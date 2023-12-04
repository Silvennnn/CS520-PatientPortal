from server.database.models import Base
from server.database.postgresql import engine, SessionLocal
from server.curd.user_crud import UserCRUD
import logging
from server.schemas.user_schemas import *
from server.utils import security
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, FastAPI
from pydantic.tools import parse_obj_as
from fastapi.security import OAuth2PasswordRequestForm
from server.utils.config import settings

logging.getLogger("fastapi")

Base.metadata.create_all(bind=engine)

app = FastAPI()

user_crud = UserCRUD()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/login/access-token", response_model=LoggedInUser)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = user_crud.authenticate_user(db, form_data.username, form_data.password)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_jwt_token(
        data={"sub": str(user.user_uuid)}, expires_delta=access_token_expires
    )
    user = user_crud.get_user_by_token(db, access_token)
    user = user.__dict__
    user["access_token"] = access_token
    user["token_type"] = "bearer"
    user = parse_obj_as(LoggedInUser, user)
    return user


@app.post("/user/createUser/", response_model=UserProfileSchemas)
def create_user_api(user: CreateUserSchemas, db: Session = Depends(get_db)):
    if user.account_type != 0 and user.account_type != 1:
        raise HTTPException(404, "User type is not acceptable!")
    if user_crud.get_user_by_account_name(db=db, account_name=user.account_name):
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user_model = user_crud.create_user(db=db, create_user_schemas=user)
    return parse_obj_as(UserProfileSchemas, db_user_model)


@app.get("/user/getUserByUUID/", response_model=UserProfileSchemas)
def get_user_by_uuid(user_uuid: UUID, token: str, db: Session = Depends(get_db)):
    # need add current user for example paitent should not have access to this api beside reading himself
    if isinstance(user_uuid, UUID) == False:
        raise HTTPException(400, "the input is not UUID")
    query_user = user_crud.get_user_by_uuid_and_token(
        db=db, token=token, uuid=user_uuid
    )
    if query_user is None or (isinstance(query_user, list) and len(query_user) == 0):
        raise HTTPException(400, "No such user with provided UUID")
    return parse_obj_as(UserProfileSchemas, query_user)


@app.get("/user/getMe/", response_model=UserProfileSchemas)
def get_me_by_token(token: str, db: Session = Depends(get_db)):
    return user_crud.get_user_by_token(db=db, token=token)


@app.get("/user/getUserByAccountName/", response_model=UserProfileSchemas)
def get_user_by_account_name(account_name: str, db: Session = Depends(get_db)):
    # need add current user for example paitent should not have access to this api beside reading himself
    query_user = user_crud.get_user_by_account_name(db=db, account_name=account_name)
    if query_user is None or (isinstance(query_user, list) and len(query_user) == 0):
        raise HTTPException(400, "No such user with provided account name")
    return parse_obj_as(UserProfileSchemas, query_user)
