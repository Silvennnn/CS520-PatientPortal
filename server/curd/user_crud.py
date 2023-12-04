import logging

from sqlalchemy.orm import Session
from server.schemas.user_schemas import *
from server.database.models import User
from server.utils.security import get_password_hash

class UserCRUD:
    def __init__(self) -> None:
        self.model = User

    def create_user(self, db: Session, create_user_schemas: CreateUserSchemas) -> User:
        new_user = create_user_schemas.dict()
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
            db.query(self.model).filter(self.model.account_name == account_name)
            .first()
        )

    def get_user_by_uuid(self, db: Session, user_uuid: UUID) -> User:
        return (
            db.query(self.model).filter(self.model.user_uuid == user_uuid)
            .first()
        )