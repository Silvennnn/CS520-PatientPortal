import logging
from typing import List
from uuid import UUID

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from server.crud.crud_utils import get_user_by_token, is_doctor_associated_with_patient, get_by_account_name
from server.database.models import User, Appointment, MedicalRecord
from server.schemas.user_schemas import CreateUserSchemas, UpdateUserSchemas
from server.utils.security import get_password_hash
from server.utils.security import verify_password


class UserCRUD:
    def __init__(self) -> None:
        self.model = User

    def create_user(self, db: Session, create_user_schemas: CreateUserSchemas) -> User:
        new_user = create_user_schemas.__dict__
        hashed_password = get_password_hash(create_user_schemas.password)
        new_user["account_name"] = str(create_user_schemas.account_name)
        new_user["hashed_password"] = hashed_password
        new_user["account_type"] = create_user_schemas.account_type
        new_user["last_name"] = str(create_user_schemas.last_name)
        new_user["first_name"] = str(create_user_schemas.first_name)
        new_user.pop("password", None)
        new_user = self.model(**new_user)
        db.add(new_user)
        try:
            db.commit()
            db.refresh(new_user)
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
            return None
        return new_user

    def get_user_by_account_name(self, db: Session, account_name: str) -> User:
        return (
            db.query(self.model).filter(self.model.account_name == account_name).first()
        )

    def get_user_by_uuid(self, db: Session, user_uuid: UUID) -> User:
        return db.query(self.model).filter(self.model.user_uuid == user_uuid).first()

    def authenticate_user(self, db: Session, user_name: str, password: str) -> User:
        """
        verify user's password
        """

        user_name = user_name

        user = self.get_user_by_account_name(db, user_name)
        if not user:
            raise HTTPException(status_code=401, detail="Username not found")
        if not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        return user

    def get_user_by_uuid_and_token(self, db: Session, token: str, uuid: UUID):
        current_user = get_user_by_token(db=db, token=token)
        current_uuid = current_user.user_uuid
        if current_user.account_type == 0 and current_user.user_uuid != uuid:
            raise HTTPException(
                status_code=401,
                detail="patient user could not get user info other than him/herself",
            )
        if current_user.account_type == 1 and current_user.user_uuid != uuid:
            if not is_doctor_associated_with_patient(db=db, doctor_uuid=current_uuid, patient_uuid=uuid):
                raise HTTPException(
                    status_code=401,
                    detail="doctor user could not get user info other than patient "
                    "that he/her associated with",
                )
            query_user = self.get_user_by_uuid(db, current_uuid)
            return query_user
        return current_user

    def get_user_by_account_name_and_token(
        self, db: Session, token: str, account_name: str
    ):
        current_user = get_user_by_token(db=db, token=token)
        current_uuid = current_user.user_uuid
        current_account_name = current_user.account_name
        if current_user.account_type == 0 and current_account_name != account_name:
            raise HTTPException(
                status_code=401,
                detail="patient user could not get user info other than him/herself",
            )
        if current_user.account_type == 1 and current_account_name != account_name:
            query_user = get_by_account_name(db, account_name)
            if not is_doctor_associated_with_patient(db=db, doctor_uuid=current_uuid, patient_uuid=query_user.user_uuid):
                raise HTTPException(
                    status_code=401,
                    detail="doctor user could not get user info other than patient "
                           "that he/her associated with",
                )
            return query_user
        return current_user

    def get_patient_uuid_from_result(
        self, results: List[Appointment | MedicalRecord]
    ) -> List[UUID]:
        return [entry.patient_uuid for entry in results]

    def get_patient_account_name_from_result(
        self, db: Session, results: List[Appointment | MedicalRecord]
    ) -> List[str]:
        return [
            self.get_user_by_uuid(db, entry.patient_uuid).account_name
            for entry in results
        ]

    def update_user_info(
        self, db: Session, token: str, update_user_schemas: UpdateUserSchemas
    ):
        current_user = get_user_by_token(db=db, token=token)
        stmt = db.query(self.model).filter(
            self.model.user_uuid == current_user.user_uuid
        )
        db_user = jsonable_encoder(current_user)
        update_user_schemas = update_user_schemas.__dict__
        update_elem = {}
        for user_field in db_user:
            if (
                user_field in update_user_schemas
                and update_user_schemas[user_field] != None
                and len(update_user_schemas[user_field]) != 0
            ):
                update_elem[user_field] = update_user_schemas[user_field]
        stmt.update(update_elem, synchronize_session=False)
        updated_user = None
        try:
            db.commit()
            updated_user = stmt.first()
        except Exception as e:
            print(e)
            # raise utils.DatabaseCommitError(e)
        finally:
            return updated_user
