from sqlalchemy import create_engine, String, Column, URL
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

host = os.environ.get("host")
port = os.environ.get("port")
username = os.environ.get("username")
dbname = os.environ.get("dbname")
password = os.environ.get("password")
DATABASE_URL = URL.create(
    "postgresql",
    username=username,
    password=password,  # plain (unescaped) text
    host=host,
    database=dbname,
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
