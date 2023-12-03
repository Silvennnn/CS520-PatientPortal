from fastapi import FastAPI, Depends
from server.database.postgresql import SessionLocal, engine
from server.database import models
from server.curd.user_crud import *
from server.schemas.user_schemas import *
from server.api.deps import get_db

# models.Base.metadata.create_all(bind=engine)
# print("hello")
app = FastAPI()

logger = logging.getLogger(__name__)

new_user = CreateUserSchemas.model_validate({
    "account_name": "test_user",
    "password": "test_password",
    "first_name": "kai",
    "last_name": "ye",
    "date_of_birth": date.fromisoformat("2019-12-04"),
    "account_type": 0,
    "gender": "male"
})


@app.post("/user/", response_model=UserProfileSchemas)
def create_user(create_user: CreateUserSchemas, db: Session = Depends(get_db)):
    return create_user(db=db, create_user=create_user)
