from server.schemas.schemas_base import BaseConfig
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class CreateAppointmentSchemas(BaseConfig):
    datetime: datetime
    location: Optional[List[str]] = []
    doctor_account_name: str
    patient_account_name: str
    message: Optional[str]
    status: int = 0


class ReturnAppointmentSchemas(CreateAppointmentSchemas):
    appointment_uuid: UUID
    doctor_uuid: UUID
    patient_uuid: UUID


class UpdateAppointmentSchemas(BaseConfig):
    datetime: Optional[datetime]
    location: Optional[List[str]] = []
    message: Optional[str]


class UpdateAppointmentStatusSchames(BaseConfig):
    appointment_uuid: UUID
    status: int
