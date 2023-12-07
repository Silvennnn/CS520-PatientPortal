from server.schemas.medical_record_schemas import (
    UpdateMedicalRecordSchemas,
    CreateMedicalRecordSchemas,
)
from server.database.models import MedicalRecord
from server.crud.crud_utils import (
    get_user_by_token,
    is_doctor_associated_with_patient,
    get_by_account_name,
    get_account_name_by_uuid,
)
from sqlalchemy.orm import Session
from fastapi import HTTPException
from copy import copy
from typing import List
from uuid import UUID


class MedicalRecordCRUD:
    def __int__(self):
        pass

    def create_medical_record(
        self,
        db: Session,
        token: str,
        create_medical_record_schemas: CreateMedicalRecordSchemas,
    ):
        submit_user = get_user_by_token(db=db, token=token)
        # if submit_user.account_type == 0:
        #     raise HTTPException(
        #         status_code=401,
        #         detail="Only doctor can create medical record",
        #     )
        # if (
        #     submit_user.account_name
        #     != create_medical_record_schemas.doctor_account_name
        # ):
        #     raise HTTPException(
        #         status_code=401,
        #         detail="You can create medical record for your own",
        #     )
        patient = get_by_account_name(
            db=db, account_name=create_medical_record_schemas.patient_account_name
        )
        doctor = get_by_account_name(
            db=db, account_name=create_medical_record_schemas.doctor_account_name
        )
        # if not is_doctor_associated_with_patient(
        #     db=db, doctor_uuid=submit_user.user_uuid, patient_uuid=patient.user_uuid
        # ):
        #     raise HTTPException(
        #         status_code=401,
        #         detail="The Patient is not associated with you",
        #     )
        if (
            submit_user.account_name
            != create_medical_record_schemas.doctor_account_name
            and submit_user.account_name
            != create_medical_record_schemas.patient_account_name
        ):
            raise HTTPException(
                status_code=401,
                detail="You can create your own medical record",
            )

        create_record = copy(create_medical_record_schemas.__dict__)
        create_record.pop("patient_account_name")
        create_record.pop("doctor_account_name")
        create_record["doctor_uuid"] = doctor.user_uuid
        create_record["patient_uuid"] = patient.user_uuid
        create_record = MedicalRecord(**create_record)
        db.add(create_record)
        try:
            db.commit()
            db.refresh(create_record)
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
            return None
        return create_record

    def get_medical_records_by_account_name(
        self,
        db: Session,
        token: str,
        account_name: str,
    ):
        current_user = get_user_by_token(db=db, token=token)
        current_uuid = current_user.user_uuid
        if current_user.account_type != 1 and current_user.account_name != account_name:
            raise HTTPException(
                status_code=401,
                detail="patient account can look get it own medical record",
            )

        if current_user.account_type == 0:
            return db.query(MedicalRecord).filter(
                MedicalRecord.patient_uuid == current_uuid
            )
        elif current_user.account_type == 1:
            target_user = get_by_account_name(db=db, account_name=account_name)
            if (
                target_user.user_uuid == current_user.user_uuid
            ):  # doctor looking for him/herself
                return db.query(MedicalRecord).filter(
                    MedicalRecord.doctor_uuid == current_uuid
                )
            else:
                if target_user.account_type == 1:  # doctor is looking for other doctor
                    raise HTTPException(
                        status_code=401, detail="you cannot look for other doctors"
                    )
                else:  # doctor is looking for patient
                    target_user_uuid = target_user.user_uuid
                    if is_doctor_associated_with_patient(
                        db=db, doctor_uuid=current_uuid, patient_uuid=target_user_uuid
                    ):
                        return db.query(MedicalRecord).filter(
                            MedicalRecord.patient_uuid == target_user_uuid
                        )
                    else:
                        raise HTTPException(
                            status_code=401, detail="you cannot look for this patient"
                        )
        else:
            raise HTTPException(status_code=401, detail="unexpected user account type")

    def get_medical_records_by_token(
        self, db: Session, token: str
    ) -> List[MedicalRecord]:
        current_user = get_user_by_token(db=db, token=token)
        current_uuid = current_user.user_uuid
        if current_user.account_type == 0:
            return db.query(MedicalRecord).filter(
                MedicalRecord.patient_uuid == current_uuid
            )
        elif current_user.account_type == 1:
            return db.query(MedicalRecord).filter(
                MedicalRecord.doctor_uuid == current_uuid
            )
        else:
            raise HTTPException(status_code=401, detail="unexpected user account type")

    def get_medical_record_by_uuid(
        self, db: Session, medical_record_uuid: UUID
    ) -> MedicalRecord:
        medical_record = (
            db.query(MedicalRecord)
            .filter(MedicalRecord.medical_record_uuid == medical_record_uuid)
            .first()
        )
        if medical_record is None:
            raise HTTPException(
                status_code=401, detail="The medical record uuid you provide is invalid"
            )
        return medical_record

    def update_medical_record_By_UUID(
        self,
        db: Session,
        token: str,
        medical_record_uuid: UUID,
        update_medical_record_schemas: UpdateMedicalRecordSchemas,
    ) -> MedicalRecord:
        update_info_dict = update_medical_record_schemas.__dict__
        allowed_field = update_info_dict.keys()
        update_field = {}
        current_user = get_user_by_token(db=db, token=token)
        # if current_user.account_type == 0:
        #     raise HTTPException(
        #         status_code=401,
        #         detail="patient does not allow to update medical record",
        #     )
        stmt = db.query(MedicalRecord).filter(
            MedicalRecord.medical_record_uuid == medical_record_uuid
        )
        current_medical_record = stmt.first()
        if current_medical_record == None:
            raise HTTPException(
                status_code=401,
                detail="the medical record you provide is invalid",
            )
        patient_account_name = get_account_name_by_uuid(
            db=db, user_uuid=current_medical_record.patient_uuid
        )
        doctor_account_name = get_account_name_by_uuid(
            db=db, user_uuid=current_medical_record.doctor_uuid
        )
        if (
            current_user.account_name != patient_account_name
            and current_user.account_name != doctor_account_name
        ):
            raise HTTPException(
                status_code=401,
                detail="You can only update ur own medical record",
            )
        # if current_user.account_type == 1:
        #     if current_medical_record.doctor_uuid != current_user.user_uuid:
        #         raise HTTPException(
        #             status_code=401,
        #             detail="the medical record uuid you provide is not belongs to you",
        #         )
        # else:
        #     raise HTTPException(status_code=401, detail="unexpected user account type")

        current_medical_record = current_medical_record.__dict__
        for record_filed in current_medical_record:
            if (
                record_filed in allowed_field
                and record_filed in update_info_dict
                and update_info_dict[record_filed] is not None
            ):
                update_field[record_filed] = update_info_dict[record_filed]
        stmt.update(update_field, synchronize_session=False)
        updated_record = None
        try:
            db.commit()
            updated_record = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return updated_record

    def delete_medical_record_by_uuid(
        self, db: Session, token: str, medical_record_uuid: UUID
    ):
        current_user = get_user_by_token(db=db, token=token)
        if current_user.account_type == 0:
            raise HTTPException(
                status_code=401,
                detail="Patient cannot delete medical record",
            )
        stmt = db.query(MedicalRecord).filter(
            MedicalRecord.medical_record_uuid == medical_record_uuid
        )
        current_medical_record = stmt.first()
        if current_medical_record is None:
            raise HTTPException(
                status_code=401,
                detail="The medical record uuid you provide is invalid",
            )
        if current_medical_record.doctor_uuid != current_user.user_uuid:
            raise HTTPException(
                status_code=401,
                detail="This medical record does not belongs to you",
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
