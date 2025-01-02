from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    # MongoDB Configuration
    MONGO_URI = os.getenv("MONGO_URI") 

    # Flask App Secrets
    SECRET_KEY = os.getenv("SECRET_KEY") 
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  

    # Email Configuration
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME") 
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD") 