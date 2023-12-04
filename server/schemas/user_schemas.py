from server.schemas.schemas_base import BaseConfig
from uuid import UUID
from typing import Optional, List
from datetime import date


class CreateUserSchemas(BaseConfig):
    account_name: str
    password: str
    account_type: int
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: date
    gender: str
    address: Optional[List[str]] = []


class UpdateUserSchemas(BaseConfig):
    address: Optional[List[str]] = []
    phone_number: Optional[str] = None


class UserProfileSchemas(BaseConfig):
    user_uuid: UUID
    account_name: str
    account_type: int
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    phone_number: str
    date_of_birth: date
    gender: str
    address: Optional[List[str]] = []


class LoggedInUser(UserProfileSchemas):
    access_token: str
    token_type: str
