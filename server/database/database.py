from sqlalchemy import create_engine, String, Column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://kai_ye:0Jm2fvuxpBAKbHflQiNALA@rough-quetzal-12554.7tt.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()