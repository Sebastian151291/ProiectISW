from pydantic import BaseModel
from datetime import datetime
from typing import List
from enum import Enum

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: datetime

    class Config:
        orm_mode = True
        exclude = {"user"}

class Objective(str, Enum):
    WEIGHT_LOSS = "Weight loss"
    MAINTAIN = "Maintain"
    WEIGHT_GAIN = "Weight Gain"

class ProfileBase(BaseModel):
    age: int
    weight: float
    height: float
    objectives: Objective

    class Config:
        orm_mode = True
        exclude = {"user"}

class UserBase(BaseModel):
    username: str
    password: str

class UserInDB(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True
        exclude = {'password'}

class Token(BaseModel):
    access_token: str
    token_type: str