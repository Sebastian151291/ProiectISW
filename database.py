from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DB_PASSWORD = os.getenv("DB_PASSWORD")

URL_DATABASE = f'mysql+pymysql://root:Pepsicola151@localhost:3306/prjisw'

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()