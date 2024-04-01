from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from database import SessionLocal, engine
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
import jwt
import models
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = (
    "http://localhost:3000",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TranscationModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

models.Base.metadata.create_all(bind=engine)

# Secret key for JWT token
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token expiration time (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class User(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

# Create file handler
file_handler = logging.FileHandler("error.log")
file_handler.setLevel(logging.ERROR)

# Create formatter and add it to the handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add file handler to logger
logger.addHandler(file_handler)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/transactions/", response_model=TranscationModel)
async def create_transaction(transaction: TransactionBase, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TranscationModel])
async def read_transaction(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

@app.put("/transactions/{transaction_id}", response_model=TranscationModel)
async def update_transaction(
    transaction_id: int,
    updated_transaction: TransactionBase,
    db: Session = Depends(get_db)
):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update the relevant fields
    db_transaction.amount = updated_transaction.amount
    db_transaction.category = updated_transaction.category
    db_transaction.description = updated_transaction.description
    db_transaction.is_income = updated_transaction.is_income
    db_transaction.date = updated_transaction.date

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{transaction_id}", response_model=TranscationModel)
async def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(db_transaction)
    db.commit()
    return db_transaction

@app.post("/register/")
async def register(user: User, db: Session = Depends(get_db)):
    try:
        # Check if the username already exists
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

        # Hash the password
        hashed_password = pwd_context.hash(user.password)

        # Create a new user
        new_user = models.User(username=user.username, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()

        # Generate access token for the newly registered user
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        # Log the error and return an appropriate response
        logger.error(f"Error occurred during user registration: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

# JWT token creation function
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# User authentication function
def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# Dependency to get the current user from JWT token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.DecodeError:
        raise credentials_exception
    db = SessionLocal()
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/login/")
async def login(user: User, db: Session = Depends(get_db)):
    try:
        authenticated_user = authenticate_user(db, user.username, user.password)
        if not authenticated_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        # Log the error and return an appropriate response
        logger.error(f"Error occurred during user login: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
