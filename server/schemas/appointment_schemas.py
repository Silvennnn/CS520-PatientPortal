from server.schemas.schemas_base import BaseConfig
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class CreateAppointmentSchemas(BaseConfig):
    datetime: datetime
    location: Optional[str] = None
    doctor_account_name: str
    patient_account_name: str
    message: Optional[str]
    status: int = 0


class ReturnAppointmentSchemas(CreateAppointmentSchemas):
    appointment_uuid: UUID
    doctor_uuid: UUID
    patient_uuid: UUID


class UpdateAppointmentSchemas(BaseConfig):
    datetime: Optional[datetime] = None
    location: Optional[str] = None
    message: Optional[str] = None


class UpdateAppointmentStatusSchames(BaseConfig):
    appointment_uuid: UUID
    status: int
