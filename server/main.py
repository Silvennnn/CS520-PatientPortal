from server.database.models import Base
from server.database.postgresql import engine, SessionLocal
from server.curd.user_crud import UserCRUD
import logging
from server.schemas.user_schemas import *
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, FastAPI
from pydantic.tools import parse_obj_as

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


@app.post("/createUser/", response_model=UserProfileSchemas)
def create_user_api(user: CreateUserSchemas, db: Session = Depends(get_db)):
    logging.info(user.account_type)
    if user.account_type != 0 and user.account_type != 1:
        raise HTTPException(404, "User type is not acceptable!")
    if user_crud.get_user_by_account_name(db=db, account_name=user.account_name):
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user_model = user_crud.create_user(db=db, create_user_schemas=user)
    return parse_obj_as(UserProfileSchemas, db_user_model)
