from server.schemas.medical_record_schemas import (
    UpdateMedicalRecordSchemas,
    CreateMedicalRecordSchemas,
    ReturnMedicalRecordSchemas,
)
from server.database.models import MedicalRecord
from server.crud.crud_utils import (
    get_user_by_token,
    is_doctor_associated_with_patient,
    get_by_account_name,
)
from sqlalchemy.orm import Session
from fastapi import HTTPException
from copy import copy


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
        if submit_user.account_type == 0:
            raise HTTPException(
                status_code=401,
                detail="Only doctor can create medical record",
            )
        if submit_user.account_name != create_medical_record_schemas.doctor_account_name:
            raise HTTPException(
                status_code=401,
                detail="You can create medical record for your own",
            )
        patient = get_by_account_name(
            db=db, account_name=create_medical_record_schemas.patient_account_name
        )
        if not is_doctor_associated_with_patient(
            db=db, doctor_uuid=submit_user.user_uuid, patient_uuid=patient.user_uuid
        ):
            raise HTTPException(
                status_code=401,
                detail="The Patient is not associated with you",
            )
        create_record = copy(create_medical_record_schemas.__dict__)
        create_record.pop("patient_account_name")
        create_record.pop("doctor_account_name")
        create_record["doctor_uuid"] = submit_user.user_uuid
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
            if target_user.user_uuid == current_user.user_uuid:  # doctor looking for him/herself
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
