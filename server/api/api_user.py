# from server.app.app import app
# from server.schemas.user_schemas import *
# from server.curd.user_crud import *
# from server.api.deps import get_db
# from fastapi import Depends, HTTPException, APIRouter
# from server.database.models import User
# from pydantic.tools import parse_obj_as
# from fastapi.openapi.utils import get_openapi
#
# user_crud = UserCRUD
# router = APIRouter(
#     tags=["users"]
# )
# @app.post("/creatUser/", response_model=UserProfileSchemas)
# def create_user_api(user: CreateUserSchemas, db: Session = Depends(get_db())):
#     if user.account_type != 0 or user.account_type != 1:
#         raise HTTPException(404, "User type is not acceptable!")
#     get_user_schemas = GetUserByUUIDSchemas({"account_name": user.account_name})
#     if user_crud.get_user_by_account_name(db=db, get_user_schemas=get_user_schemas):
#         raise HTTPException(status_code=400, detail="Username already registered")
#     db_user_model = user_crud.create_user(db=db, user=user)
#     return parse_obj_as(UserProfileSchemas, db_user_model)
