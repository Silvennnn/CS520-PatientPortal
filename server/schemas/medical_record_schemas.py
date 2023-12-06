from server.schemas.schemas_base import BaseConfig
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class UpdateMedicalRecordSchemas(BaseConfig):
    symptom: Optional[str]
    diagnosis: Optional[str]
    Medication: Optional[List[str]]


class CreateMedicalRecordSchemas(UpdateMedicalRecordSchemas):
    date_of_visit: datetime
    doctor_account_name: str
    patient_account_name: str


class ReturnMedicalRecordSchemas(CreateMedicalRecordSchemas):
    medical_record_uuid: UUID
    doctor_uuid: UUID
    patient_uuid: UUID
