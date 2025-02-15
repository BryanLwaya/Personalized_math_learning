from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from pymongo import MongoClient
import redis
from app.auth.auth_routes import is_token_revoked
# from app.models import setup_performance_collections

# Initialize Flask extensions
jwt = JWTManager()

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    app.bcrypt = Bcrypt(app)  
    app.mail = Mail(app)
    jwt.init_app(app)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # MongoDB client
    mongo_client = MongoClient(app.config["MONGO_URI"])
    app.db = mongo_client.MathGoalDB
    # setup_performance_collections(app.db)


    # Register routes
    with app.app_context():
        from .routes import api
        from .auth.auth_routes import auth_bp
        from .student_routes import student_api
        from .teacher_routes import teacher_api
        from .performance_routes import performance_api
        app.register_blueprint(api)
        app.register_blueprint(auth_bp)
        app.register_blueprint(student_api)
        app.register_blueprint(teacher_api)
        app.register_blueprint(performance_api)
    
    # Register JWT revocation callback
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return is_token_revoked(jwt_header, jwt_payload)

    # Pass Redis client to app context
    app.redis_client = redis_client

    return app
