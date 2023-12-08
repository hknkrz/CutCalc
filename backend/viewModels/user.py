import uuid

from pydantic import BaseModel, EmailStr


class ViewUser(BaseModel):
    user_id: uuid.UUID
    email: EmailStr


class UserCreate(BaseModel):
    email: EmailStr

