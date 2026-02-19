from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    
    DATABASE_URL: str
    
    APP_NAME: str = "PhoneStore API"
    DEBUG: bool = False
    
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend-domain.com"  
    ]
    
    # M-Pesa
    CONSUMER_KEY: str
    CONSUMER_SECRET: str
    SHORTCODE: str
    PASSKEY: str
    CALLBACK_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()