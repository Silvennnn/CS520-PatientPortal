from pydantic import BaseModel


class BaseConfig(BaseModel):
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
