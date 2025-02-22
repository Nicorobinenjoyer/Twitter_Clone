from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    class Config:
        orm_mode = True

class TweetCreate(BaseModel):
    content: str
    owner_id: int

class TweetResponse(BaseModel):
    id: int
    content: str
    owner: UserResponse
    class Config:
        orm_mode = True

class CommentCreate(BaseModel):
    content: str
    owner_id: int