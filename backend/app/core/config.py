from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "HireWell AI Matching API"
    environment: str = "dev"
    debug: bool = True
    database_url: str = "sqlite+pysqlite:///./hirewell.db"
    openai_api_key: str | None = None
    embedding_model: str = "text-embedding-3-small"
    shortlist_threshold: float = 80.0
    review_threshold: float = 60.0

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
