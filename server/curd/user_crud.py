import logging

from sqlalchemy.orm import Session
from fastapi import Depends
from server.api.deps import get_db
from server.schemas.user_schemas import CreateUserSchemas
from fastapi import HTTPException

logger = logging.getLogger(__name__)


def create_user(db: Session, create_user: CreateUserSchemas):
    new_user = create_user.dict()
    new_user["account_name"] = str(create_user.account_name)
    new_user["hashed_password"] = create_user.password
    if create_user.account_type != 0 and create_user.account_type != 1:
        raise HTTPException(
            status_code=406,
            detail="Unacceptable user role",
        )
    new_user["account_type"] = create_user.account_type
    new_user["last_name"] = str(create_user.last_name)
    new_user["first_name"] = str(create_user.first_name)
    db.add(new_user)
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        print(e)
        # raise utils.DatabaseCommitError(e)
        return None
    print("successfully")
