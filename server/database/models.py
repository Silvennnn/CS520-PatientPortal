from email.policy import default
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql.sqltypes import (
    BOOLEAN,
    INTEGER,
    JSON,
    VARCHAR,
    Date,
    DateTime,
    NUMERIC,
    TEXT,
    Time,
)

Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    account_name = Column(VARCHAR(16), nullable=False, unique=True)
    hashed_password = Column(VARCHAR(70), nullable=False)
    user_uuid = Column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    account_type = Column(INTEGER, default=0)  # {0: patient, 1: doctor}
    first_name = Column(VARCHAR(32), nullable=False)
    last_name = Column(VARCHAR(32), nullable=False)
    middle_name = Column(VARCHAR(32))
    phone_number_number = Column(VARCHAR(16))
    date_of_birth = Column(Date, nullable=False)
    gender = Column(VARCHAR(16), nullable=False)
    address = Column(ARRAY(VARCHAR(32)))

    patient_appointment = relationship(
        "patient_appointment",
        primaryjoin="if User.account_type==0",
        back_populates="patient",
    )
    patient_medical_record = relationship(
        "patient_medical_record",
        primaryjoin="if User.account_type==0",
        back_populates="patient",
    )
    doctor_appointment = relationship(
        "doctor_appointment",
        primaryjoin="if User.account_type==1",
        back_populates="doctor",
    )
    doctor_medical_record = relationship(
        "doctor_medical_record",
        primaryjoin="if User.account_type==1",
        back_populates="doctor",
    )

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class Appointment(Base):
    __tablename__ = "appointment"
    appointment_uuid = Column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    datetime = Column(DateTime, nullable=False)
    location = Column(ARRAY(VARCHAR(32)))
    doctor_uuid = Column(
        UUID(as_uuid=True), ForeignKey("user.user_uuid"), nullable=False
    )
    patient_uuid = Column(
        UUID(as_uuid=True), ForeignKey("user.user_uuid"), nullable=False
    )
    Message = Column(TEXT)

    doctor = relationship("doctor", back_populates="doctor_appointment")
    patient = relationship("patient", back_populates="patient_appointment")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class medical_record(Base):
    __tablename__ = "medical_record"
    medical_record_uuid = Column(
        UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4
    )
    date_of_visit = Column(DateTime)
    doctor_uuid = Column(
        UUID(as_uuid=True), ForeignKey("user.user_uuid"), nullable=False
    )
    patient_uuid = Column(
        UUID(as_uuid=True), ForeignKey("user.user_uuid"), nullable=False
    )
    symptom = Column(TEXT)
    diagnosis = Column(TEXT)
    Medication = Column(ARRAY(TEXT))

    doctor = relationship("doctor", back_populates="doctor_medical_record")
    patient = relationship("patient", back_populates="patient_medical_record")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)