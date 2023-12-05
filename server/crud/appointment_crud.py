from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.crud.crud_utils import get_user_by_token, get_by_account_name
from server.database.models import Appointment, MedicalRecord
from server.schemas.appointment_schemas import CreateAppointmentSchemas
from uuid import UUID
from sqlalchemy import and_


class AppointmentCRUD:
    def __int__(self) -> None:
        self.db_model = Appointment

    def create_appointment(
        self,
        db: Session,
        token: str,
        create_appointment_schemas: CreateAppointmentSchemas,
    ) -> Appointment:
        submit_user = get_user_by_token(db=db, token=token)
        if (
            submit_user.account_type == 0
            and create_appointment_schemas.patient_account_name
            != submit_user.account_name
        ) or (
            submit_user.account_type == 1
            and create_appointment_schemas.doctor_account_name
            != submit_user.account_name
        ):
            raise HTTPException(
                status_code=401,
                detail="the account type does not match with corrspoding account name",
            )

        if submit_user.account_type == 0 and create_appointment_schemas.status == 1:
            raise HTTPException(
                status_code=401, detail="patient could not confirm the appointment"
            )

        if create_appointment_schemas.status == -1:
            raise HTTPException(
                status_code=401, detail="you could not created a canceled appointment"
            )
        patient = get_by_account_name(
            db=db, account_name=create_appointment_schemas.patient_account_name
        )
        if patient is None:
            raise HTTPException(status_code=401, detail="No such patient account name")
        patient_uuid = patient.user_uuid
        doctor = get_by_account_name(
            db=db, account_name=create_appointment_schemas.doctor_account_name
        )
        if doctor is None:
            raise HTTPException(status_code=401, detail="No such doctor account name")
        doctor_uuid = doctor.user_uuid
        create_appointment = create_appointment_schemas.__dict__
        create_appointment.pop("patient_account_name")
        create_appointment.pop("doctor_account_name")
        create_appointment["doctor_uuid"] = doctor_uuid
        create_appointment["patient_uuid"] = patient_uuid
        create_appointment = Appointment(**create_appointment)
        db.add(create_appointment)
        try:
            db.commit()
            db.refresh(create_appointment)
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
            return None
        return create_appointment

    def get_appointments_by_token(self, db: Session, token: str) -> List[Appointment]:
        current_user = get_user_by_token(db=db, token=token)

        current_uuid = current_user.user_uuid
        if current_user.account_type == 0:
            return db.query(Appointment).filter(
                Appointment.patient_uuid == current_uuid
            )
        elif current_user.account_type == 1:
            return db.query(Appointment).filter(Appointment.doctor_uuid == current_uuid)
        else:
            raise HTTPException(status_code=401, detail="unexpected user account type")

    def get_appointments_by_account_name(
        self, db: Session, token: str, account_name: str
    ) -> List[Appointment]:
        current_user = get_user_by_token(db=db, token=token)
        current_uuid = current_user.user_uuid
        if current_user.account_type != 1 and current_user.account_name != account_name:
            raise HTTPException(
                status_code=401,
                detail="patient account can look get it own appointments",
            )

        if current_user.account_type == 0:
            return db.query(Appointment).filter(
                Appointment.patient_uuid == current_uuid
            )
        elif current_user.account_type == 1:
            target_user = get_by_account_name(db=db, account_name=account_name)
            if target_user.account_type == 1:
                raise HTTPException(
                    status_code=401, detail="you cannot look for other doctors"
                )
            target_user_uuid = target_user.user_uuid
            if self.is_doctor_associated_with_patient(
                db=db, doctor_uuid=current_uuid, patient_uuid=target_user_uuid
            ):
                return db.query(Appointment).filter(
                    Appointment.patient_uuid == target_user_uuid
                )
            else:
                raise HTTPException(
                    status_code=401, detail="you cannot look for this patient"
                )
        else:
            raise HTTPException(status_code=401, detail="unexpected user account type")

    def is_doctor_associated_with_patient(
        self, db: Session, doctor_uuid: UUID, patient_uuid: UUID
    ) -> bool:
        associated_appointments = (
            db.query(Appointment)
            .filter(
                and_(
                    Appointment.doctor_uuid == doctor_uuid,
                    Appointment.patient_uuid == patient_uuid,
                )
            )
            .count()
            > 0
        )
        associated_medical_record = (
            db.query(MedicalRecord)
            .filter(
                and_(
                    MedicalRecord.doctor_uuid == doctor_uuid,
                    MedicalRecord.patient_uuid == patient_uuid,
                )
            )
            .count()
            > 0
        )
        return associated_appointments or associated_medical_record
