from server.schemas.schemas_base import BaseConfig
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class UpdateMedicalRecordSchemas(BaseConfig):
    symptom: Optional[str] = None
    diagnosis: Optional[str] = None
    Medication: Optional[str] = None


class CreateMedicalRecordSchemas(UpdateMedicalRecordSchemas):
    date_of_visit: str
    doctor_account_name: str
    patient_account_name: str


class ReturnMedicalRecordSchemas(BaseConfig):
    date_of_visit: datetime
    doctor_account_name: str
    patient_account_name: str
    medical_record_uuid: UUID
    doctor_uuid: UUID
    patient_uuid: UUID
    symptom: Optional[str] = None
    diagnosis: Optional[str] = None
    Medication: Optional[str] = None
