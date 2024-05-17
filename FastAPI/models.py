from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    hashed_password = Column(String(200))
    profile = relationship("Profile", back_populates="user", uselist=False)
    transactions = relationship("Transaction", back_populates="user")

class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    weight = Column(Float)
    height = Column(Float)
    objectives = Column(String(50))
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="profile")

class Transaction(Base):
    __tablename__ = 'transaction'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String(50))
    description = Column(String(50))
    is_income = Column(Boolean)
    date = Column(DateTime)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="transactions")