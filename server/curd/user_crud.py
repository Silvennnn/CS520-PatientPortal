import logging

from sqlalchemy.orm import Session
from server.schemas.user_schemas import CreateUserSchemas
from server.schemas.schemas_token import Token
from server.database.models import User
from server.utils.security import get_password_hash
from fastapi import HTTPException
from server.utils.security import verify_password
from jose import jwt, JWTError
from server.utils.config import settings
from uuid import UUID

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

    def get_user_by_token(self, db: Session, token: Token):
        user_token = token.access_token
        try:
            payload = jwt.decode(
                user_token, "secret", algorithms=[settings.JWT_ALGORITHM]
            )
            user_uuid: UUID = payload.get("sub")
            if user_uuid is None or isinstance(user_uuid, UUID):
                raise HTTPException(status_code=401, detail="Unable to verify token")
        except JWTError:
            raise HTTPException(status_code=401, detail="Unable to verify token")
        user = self.get_user_by_uuid(db, user_uuid)
        return user

    def get_user_by_uuid(self, db: Session, token: Token, uuid: UUID):
        current