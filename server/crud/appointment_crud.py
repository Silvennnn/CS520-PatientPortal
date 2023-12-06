from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.crud.crud_utils import (
    get_user_by_token,
    get_by_account_name,
    is_doctor_associated_with_patient,
)
from server.database.models import Appointment
from server.schemas.appointment_schemas import (
    CreateAppointmentSchemas,
    UpdateAppointmentSchemas,
)
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
            if target_user.user_uuid == current_user.user_uuid: # doctor looking for him/herself
                return db.query(Appointment).filter(
                    Appointment.doctor_uuid == current_uuid
                )
            else:
                if target_user.account_type == 1: # doctor is looking for other doctor
                    raise HTTPException(
                        status_code=401, detail="you cannot look for other doctors"
                    )
                else: # doctor is looking for patient
                    target_user_uuid = target_user.user_uuid
                    if is_doctor_associated_with_patient(
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

    def get_appointment_by_uuid(
        self, db: Session, appointment_uuid: UUID
    ) -> Appointment:
        appointment = (
            db.query(Appointment)
            .filter(Appointment.appointment_uuid == appointment_uuid)
            .first()
        )
        if appointment is None:
            raise HTTPException(
                status_code=401, detail="The appointment uuid you provide is invalid"
            )
        return appointment

    def update_Appointment_By_UUID(
        self,
        db: Session,
        token: str,
        appointment_uuid: UUID,
        update_appointment_schemas: UpdateAppointmentSchemas,
    ) -> Appointment:
        update_info_dict = update_appointment_schemas.__dict__
        allowed_field = update_info_dict.keys()
        update_field = {}
        current_user = get_user_by_token(db=db, token=token)
        stmt = db.query(Appointment).filter(
            Appointment.appointment_uuid == appointment_uuid
        )
        current_appointment = stmt.first()
        if current_appointment is None:
            raise HTTPException(
                status_code=401,
                detail="The appointment uuid you provide is invalid",
            )
        if current_user.account_type == 0:
            allowed_field = {
                "datetime",
                "message",
            }  # user should not update the location
            if current_appointment.patient_uuid != current_user.user_uuid:
                raise HTTPException(
                    status_code=401,
                    detail="the appointment uuid you provide is not belongs to you",
                )
            update_field[
                "status"
            ] = 0  # if user changed the appointment, the appointment auto set to appending
        elif current_user.account_type == 1:
            if current_appointment.doctor_uuid != current_user.user_uuid:
                raise HTTPException(
                    status_code=401,
                    detail="the appointment uuid you provide is not belongs to you",
                )
            update_field[
                "status"
            ] = 1  # if user changed the appointment, the appointment auto set to appending
        else:
            raise HTTPException(status_code=401, detail="unexpected user account type")

        current_appointment = current_appointment.__dict__
        for appointment_filed in current_appointment:
            if (
                appointment_filed in allowed_field
                and appointment_filed in update_info_dict
                and update_info_dict[appointment_filed] is not None
            ):
                update_field[appointment_filed] = update_info_dict[appointment_filed]
        stmt.update(update_field, synchronize_session=False)
        updated_appointment = None
        try:
            db.commit()
            updated_appointment = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return updated_appointment

    def confirm_appointment_by_uuid(
        self,
        db: Session,
        token: str,
        appointment_uuid: UUID,
    ) -> Appointment:
        current_user = get_user_by_token(db=db, token=token)
        if current_user.account_type != 1:
            raise HTTPException(
                status_code=401,
                detail="patient cannot confirm a appointment",
            )
        stmt = db.query(Appointment).filter(
            Appointment.appointment_uuid == appointment_uuid
        )
        current_appointment = stmt.first()
        if current_appointment is None:
            raise HTTPException(
                status_code=401,
                detail="The appointment uuid you provide is invalid",
            )
        if current_appointment.doctor_uuid != current_user.user_uuid:
            raise HTTPException(
                status_code=401,
                detail="This appointment does not belongs to you",
            )
        if current_appointment.status != 0:
            raise HTTPException(
                status_code=401,
                detail="This appointment is being canceled or already confirmed",
            )
        update_field = {"status": 1}
        stmt.update(update_field, synchronize_session=False)
        confirmed_appointment = None
        try:
            db.commit()
            confirmed_appointment = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return confirmed_appointment

    def cancel_appointment_by_uuid(
        self,
        db: Session,
        token: str,
        appointment_uuid: UUID,
    ) -> Appointment:
        current_user = get_user_by_token(db=db, token=token)
        stmt = db.query(Appointment).filter(
            Appointment.appointment_uuid == appointment_uuid
        )
        current_appointment = stmt.first()
        if current_appointment is None:
            raise HTTPException(
                status_code=401,
                detail="The appointment uuid you provide is invalid",
            )
        if (
            current_appointment.doctor_uuid != current_user.user_uuid
            and current_appointment.patient_uuid != current_user.user_uuid
        ):
            raise HTTPException(
                status_code=401,
                detail="This appointment does not belongs to you",
            )
        if current_appointment.status == -1:
            raise HTTPException(
                status_code=401,
                detail="This appointment is already been canceled",
            )
        update_field = {"status": -1}
        stmt.update(update_field, synchronize_session=False)
        cancelled_appointment = None
        try:
            db.commit()
            cancelled_appointment = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return cancelled_appointment

    def delete_appointment_by_uuid(
        self,
        db: Session,
        token: str,
        appointment_uuid: UUID,
    ):
        current_user = get_user_by_token(db=db, token=token)
        stmt = db.query(Appointment).filter(
            Appointment.appointment_uuid == appointment_uuid
        )
        current_appointment = stmt.first()
        if current_appointment is None:
            raise HTTPException(
                status_code=401,
                detail="The appointment uuid you provide is invalid",
            )
        if (
            current_appointment.patient_uuid != current_user.user_uuid
            and current_appointment.doctor_uuid != current_user.user_uuid
        ):
            raise HTTPException(
                status_code=401,
                detail="This appointment does not belongs to you",
            )
        stmt.delete()
        result_entry = None
        try:
            db.commit()
            result_entry = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return result_entry
