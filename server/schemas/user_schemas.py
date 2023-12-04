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
    phone_number_number: Optional[str] = None
    date_of_birth: date
    gender: str
    address: Optional[List[str]] = []


class GetUserByUUIDSchemas(BaseConfig):
    user_uuid: UUID


class GetUserByAccountNameSchemas(BaseConfig):
    account_name: str


class UpdateUserSchemas(GetUserByUUIDSchemas):
    password: str
    address: Optional[List[str]] = []
    phone_number_number: Optional[str] = None


class UserProfileSchemas(BaseConfig):
    account_name: str
    account_type: int
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    date_of_birth: date
    gender: str
