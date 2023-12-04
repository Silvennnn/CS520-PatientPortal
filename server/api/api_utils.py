from uuid import UUID

from fastapi import HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from server.database.models import User
from server.utils.config import settings
from uuid import UUID


def get_user_by_token(db: Session, token: str) -> User:
    try:
        payload = jwt.decode(token, "secret", algorithms=[settings.JWT_ALGORITHM])
        user_uuid: UUID = payload.get("sub")
        if user_uuid is None or isinstance(user_uuid, UUID):
            raise HTTPException(status_code=401, detail="Unable to verify token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Unable to verify token")
    user = db.query(User).filter(User.user_uuid == user_uuid).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Unable to verify token")
    return user


def get_by_account_name(db: Session, account_name: str) -> User:
    return db.query(User).filter(User.account_name == account_name).first()


def get_account_name_by_uuid(db: Session, user_uuid: UUID) -> str:
    user = db.query(User).filter(User.user_uuid == user_uuid).first()
    return user.account_name
