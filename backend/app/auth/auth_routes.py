from flask import Blueprint, request, jsonify, current_app, redirect
from flask_mail import Message
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from flask_jwt_extended import create_access_token, create_refresh_token
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import redis

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    db = current_app.db
    users_collection = db['Users']

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = current_app.bcrypt.generate_password_hash(password).decode('utf-8')

    verification_token = str(ObjectId())
    
    # Creating the user document
    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "is_verified": False,
        "verification_token": verification_token,  # Store the token
        "role": "student",
        "created_at": datetime.now(timezone.utc)
    }
    users_collection.insert_one(user)

    # Send verification email
    sender_email = current_app.config['MAIL_USERNAME'] 
    verification_link = f"http://localhost:5000/auth/verify-email/{user['verification_token']}"
    msg = Message("Verify Your Email", sender=("MathGoal", sender_email), recipients=[email])
    msg.body = f"Hi {name},\n\nWelcome to MathGoal! Please click the link below to verify your email address:\n\n{verification_link}\n\nThank you,\nThe MathGoal Team"
    mail = current_app.extensions['mail']
    mail.send(msg)

    return jsonify({"message": "Registration successful. Please verify your email."}), 201

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    db = current_app.db
    users_collection = db['Users']

    user = users_collection.find_one({"verification_token": token})
    if not user:
        # Redirect to the frontend error page with an alert
        return redirect(f"http://localhost:5173/auth-error?message=Invalid+or+expired+token")

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
    )

    # Redirect to the frontend success page
    return redirect("http://localhost:5173/success")

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    db = current_app.db
    users_collection = db['Users']

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if not current_app.bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid email or password"}), 401

    if not user.get("is_verified"):
        return jsonify({"message": "Email not verified", "is_verified": False}), 403

    access_token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=1))
    return jsonify({
        "access_token": access_token, 
        "user_id": str(user["_id"]),
        "role": user["role"], 
        "message": "Login successful", 
        "is_verified": True
        }), 200


@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"message": "This is a protected route"}), 200


revoked_tokens = {}
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Revokes the JWT token for logout by storing its JTI in Redis.
    """
    jti = get_jwt()["jti"]  
    expiry = datetime.now(timezone.utc) + timedelta(hours=1) 

    redis_client.setex(f"token:{jti}", int((expiry - datetime.now(timezone.utc)).total_seconds()), "revoked")
    
    return jsonify({"message": "Logged out successfully"}), 200

def is_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    """
    Callback function to check if a token has been revoked.
    """
    jti = jwt_payload["jti"]
    return redis_client.exists(f"token:{jti}") == 1