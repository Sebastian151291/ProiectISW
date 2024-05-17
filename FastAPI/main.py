from fastapi import FastAPI, HTTPException, Depends, status
from typing import List, Annotated
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from schemas import TransactionBase, ProfileBase, UserBase, UserInDB, Token
import jwt
import models
import os


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = (
    "http://localhost:3000",
    "http://192.168.1.130:3000",
    "http://webrtcpi.ddns.net:3000"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=['*'],
)

# Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

#Authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # replace with your desired token expiration time

#Security Functions
def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#Endpoints
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = get_user(db, form_data.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except HTTPException as e:
        return {"detail": str(e)}

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/")
async def read_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    return user


@app.post("/users/me/profile/", status_code=status.HTTP_201_CREATED)
async def create_profile(profile: ProfileBase, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == user.id).first()
    if db_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    db_profile = models.Profile(**profile.dict(), user_id=user.id)
    db.add(db_profile)
    db.commit()
    return {"message": "Profile created successfully"}

@app.post("/users/me/transactions/", status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: TransactionBase, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception

    db_transaction = models.Transaction(**transaction.dict(), user_id=user.id)
    db.add(db_transaction)
    db.commit()
    return {"message": "Transaction created successfully"}


@app.get("/users/me/profile/", response_model=List[ProfileBase])
async def read_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    db_transactions = db.query(models.Profile).filter(models.Profile.user_id == user.id).all()
    return db_transactions


@app.get("/users/me/transactions/", response_model=List[TransactionBase])
async def read_transactions(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username)
    if user is None:
        raise credentials_exception
    db_transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()
    return db_transactions

@app.put("/users/{user_id}/profile/{profile_id}", response_model=ProfileBase)
async def update_profile(profile_id: int, profile: ProfileBase, db: Session = Depends(get_db)):
    db_profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.query(models.Profile).filter(models.Profile.id == profile_id).update(profile.dict())
    db.commit()
    return db.query(models.Profile).filter(models.Profile.id == profile_id).first()

@app.delete("/users/{user_id}/profile/{profile_id}")
async def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.query(models.Profile).filter(models.Profile.id == profile_id).delete()
    db.commit()
    return {"message": "Profile deleted successfully"}

@app.put("/users/{user_id}/transactions/{transaction_id}", response_model=TransactionBase)
async def update_transaction(transaction_id: int, transaction: TransactionBase, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.query(models.Transaction).filter(models.Transaction.id == transaction_id).update(transaction.dict())
    db.commit()
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

@app.delete("/users/{user_id}/transactions/{transaction_id}")
async def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.query(models.Transaction).filter(models.Transaction.id == transaction_id).delete()
    db.commit()
    return {"message": "Transaction deleted successfully"}

