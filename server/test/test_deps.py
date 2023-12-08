from server.main import app, get_db, fastapi_user_crud
from fastapi.testclient import TestClient
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import Depends

client = TestClient(app)


@app.delete("/user/deleteUserByUUID/")
def delete_user_by_uuid(
    user_uuid: UUID,
    db: Session = Depends(get_db),
):
    return fastapi_user_crud.delete_user_by_uuid(db=db, user_uuid=user_uuid)
