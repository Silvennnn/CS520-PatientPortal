from server.database.models import Base
from server.database.postgresql import engine, SessionLocal
from server.crud.user_crud import UserCRUD
from server.crud.appointment_crud import AppointmentCRUD
import logging
from server.schemas.appointment_schemas import (
    CreateAppointmentSchemas,
    ReturnAppointmentSchemas,
    UpdateAppointmentSchemas,
)
from server.schemas.user_schemas import *
from server.utils import security
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, FastAPI
from pydantic.tools import parse_obj_as
from fastapi.security import OAuth2PasswordRequestForm
from server.utils.config import settings
from server.crud.crud_utils import (
    parse_list_of_appointment,
    parse_apointment,
    get_by_account_name,
    get_user_by_token,
)

logging.getLogger("fastapi")

Base.metadata.create_all(bind=engine)

app = FastAPI()

fastapi_user_crud = UserCRUD()

fastapi_appointment_crud = AppointmentCRUD()


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
    user = fastapi_user_crud.authenticate_user(
        db, form_data.username, form_data.password
    )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_jwt_token(
        data={"sub": str(user.user_uuid)}, expires_delta=access_token_expires
    )
    user = get_user_by_token(db, access_token)
    user = user.__dict__
    user["access_token"] = access_token
    user["token_type"] = "bearer"
    user = parse_obj_as(LoggedInUser, user)
    return user


@app.post("/user/createUser/", response_model=UserProfileSchemas)
def create_user_api(user: CreateUserSchemas, db: Session = Depends(get_db)):
    if user.account_type != 0 and user.account_type != 1:
        raise HTTPException(404, "User type is not acceptable!")
    if get_by_account_name(db=db, account_name=user.account_name):
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user_model = fastapi_user_crud.create_user(db=db, create_user_schemas=user)
    return parse_obj_as(UserProfileSchemas, db_user_model)


@app.get("/user/getUserByUUID/", response_model=UserProfileSchemas)
def get_user_by_uuid(user_uuid: UUID, token: str, db: Session = Depends(get_db)):
    # need add current user for example paitent should not have access to this api beside reading himself
    if not isinstance(user_uuid, UUID):
        raise HTTPException(400, "the input is not UUID")
    query_user = fastapi_user_crud.get_user_by_uuid_and_token(
        db=db, token=token, uuid=user_uuid
    )
    if query_user is None or (isinstance(query_user, list) and len(query_user) == 0):
        raise HTTPException(400, "No such user with provided UUID")
    return parse_obj_as(UserProfileSchemas, query_user)


@app.get("/user/getMe/", response_model=UserProfileSchemas)
def get_me_by_token(token: str, db: Session = Depends(get_db)):
    return get_user_by_token(db=db, token=token)


@app.get("/user/getUserByAccountName/", response_model=UserProfileSchemas)
def get_user_by_account_name(
    account_name: str, token: str, db: Session = Depends(get_db)
):
    query_user = fastapi_user_crud.get_user_by_account_name_and_token(
        db=db, token=token, account_name=account_name
    )
    if query_user is None or (isinstance(query_user, list) and len(query_user) == 0):
        raise HTTPException(400, "No such user with provided account name")
    return parse_obj_as(UserProfileSchemas, query_user)


@app.post("/user/updateUserProfile", response_model=UserProfileSchemas)
def update_user_profile(
    token: str, update_user_schemas: UpdateUserSchemas, db: Session = Depends(get_db)
):
    updated_user = fastapi_user_crud.update_user_info(
        db=db, token=token, update_user_schemas=update_user_schemas
    )
    return parse_obj_as(UserProfileSchemas, updated_user)


@app.post("/appointment/createAppointment", response_model=ReturnAppointmentSchemas)
def create_Appointment(
    token: str,
    create_appointment_schemas: CreateAppointmentSchemas,
    db: Session = Depends(get_db),
):
    new_appointment = fastapi_appointment_crud.create_appointment(
        db=db, token=token, create_appointment_schemas=create_appointment_schemas
    )
    return parse_apointment(db=db, appointment=new_appointment)


@app.get(
    "/appointment/getAppointmentByToken", response_model=List[ReturnAppointmentSchemas]
)
def get_appointments_by_token(
    token: str,
    db: Session = Depends(get_db),
):
    user_appointments = fastapi_appointment_crud.get_appointments_by_token(
        db=db, token=token
    )

    return parse_list_of_appointment(db=db, appointments=user_appointments)


@app.get(
    "/appointment/getAppointmentByAccountName",
    response_model=List[ReturnAppointmentSchemas],
)
def get_appointments_by_account_name(
    token: str,
    account_name: str,
    db: Session = Depends(get_db),
):
    user_appointments = fastapi_appointment_crud.get_appointments_by_account_name(
        db=db, token=token, account_name=account_name
    )

    return parse_list_of_appointment(db=db, appointments=user_appointments)

@app.post(
    "/appointment/updateAppointmentByUUID/",
    response_model=ReturnAppointmentSchemas,
)
def update_appointment_by_uuid(
    token:str,
    appointment_uuid: UUID,
    update_appointment_schemas: UpdateAppointmentSchemas,
    db: Session = Depends(get_db),
):
    updated_appointment = fastapi_appointment_crud.update_Appointment_By_UUID(
        db=db, token=token,appointment_uuid=appointment_uuid, update_appointment_schemas=update_appointment_schemas
    )
    return parse_apointment(db, updated_appointment)

@app.post(
    "/appointment/confirmAppointmentByUUID/",
    response_model=ReturnAppointmentSchemas
)
def confirm_appointment_by_uuid(
    token:str,
    appointment_uuid: UUID,
    db: Session = Depends(get_db),
):
    confirmed_appointment = fastapi_appointment_crud.confirm_appointment_by_uuid(
        db=db, token=token, appointment_uuid=appointment_uuid
    )
    return parse_apointment(db, confirmed_appointment)

@app.post(
    "/appointment/cancelAppointmentByUUID/",
    response_model=ReturnAppointmentSchemas
)
def cancel_appointment_by_uuid(
    token:str,
    appointment_uuid: UUID,
    db: Session = Depends(get_db),
):
    confirmed_appointment = fastapi_appointment_crud.cancel_appointment_by_uuid(
        db=db, token=token, appointment_uuid=appointment_uuid
    )
    return parse_apointment(db, confirmed_appointment)

@app.delete("/appointment/deleteAppointmentByUUID")
def delete_appointment_by_uuid(
    token: str,
    appointment_uuid: UUID,
    db: Session = Depends(get_db),
):
    return fastapi_appointment_crud.delete_appointment_by_uuid(db=db, token=token, appointment_uuid=appointment_uuid)