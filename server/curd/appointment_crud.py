from sqlalchemy.orm import Session
from server.database.models import Appointment
from typing import List
from fastapi import HTTPException
from uuid import UUID


class AppointmentCRUD:
    def __int__(self) -> None:
        self.model = Appointment

    def create_appointment(self):
        pass
