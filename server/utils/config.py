from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    SECRET_KEY: str = "secret"
    # 60 minutes * 8 hours = 8 hours
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    EMAIL_VERIFY_TOKEN_EXPIRE_MINUTES: int = 60 * 8
    JWT_ALGORITHM: str = "HS256"


settings = Settings()
