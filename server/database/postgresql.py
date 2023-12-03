from sqlalchemy import create_engine, String, Column
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(DATABASE_URL)
engine.connect()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
