from uuid import UUID

from fastapi import HTTPException
from jose import jwt, JWTError

from server.database.models import User
from server.utils.config import settings
from uuid import UUID

from server.database.models import Appointment
from server.schemas.appointment_schemas import ReturnAppointmentSchemas
from copy import copy
from typing import List
from sqlalchemy.orm import Session
from pydantic.tools import parse_obj_as
def get_user_by_token(db: Session, token: str) -> User:
    try:
        payload = jwt.decode(token, "secret", algorithms=[settings.JWT_ALGORITHM])
        user_uuid: UUID = payload.get("sub")
        if user_uuid is None or isinstance(user_uuid, UUID):
            raise HTTPException(status_code=401, detail="Unable to verify token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Unable to verify token")
    user = db.query(User).filter(User.user_uuid == user_uuid).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Unable to verify token")
    return user


def get_by_account_name(db: Session, account_name: str) -> User:
    return db.query(User).filter(User.account_name == account_name).first()


def get_account_name_by_uuid(db: Session, user_uuid: UUID) -> str:
    user = db.query(User).filter(User.user_uuid == user_uuid).first()
    return user.account_name

def parse_list_of_appointment(
        db: Session, appointments: List[Appointment]
) -> List[ReturnAppointmentSchemas]:
    result = []
    for appointment in appointments:
        result.append(parse_apointment(db=db, appointment=appointment))
    return result


def parse_apointment(db: Session, appointment: Appointment) -> ReturnAppointmentSchemas:
    patient_uuid = appointment.patient_uuid
    doctor_uuid = appointment.doctor_uuid
    patient_account_name = get_account_name_by_uuid(db=db, user_uuid=patient_uuid)
    doctor_account_name = get_account_name_by_uuid(db=db, user_uuid=doctor_uuid)
    edited_appointment = copy(appointment.__dict__)
    edited_appointment["patient_account_name"] = patient_account_name
    edited_appointment["doctor_account_name"] = doctor_account_name
    return parse_obj_as(ReturnAppointmentSchemas, edited_appointment)