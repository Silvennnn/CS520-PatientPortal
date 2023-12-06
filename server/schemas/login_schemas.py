from server.schemas.schemas_base import BaseConfig

class LoginPayload(BaseConfig):
    account_name: str
    password: str