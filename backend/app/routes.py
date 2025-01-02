from flask import Blueprint, jsonify, current_app, request
from bson.objectid import ObjectId

api = Blueprint('api', __name__)

@api.route('/users/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    db = current_app.db
    Users = db["Users"]

    try:
        user = Users.find_one({"_id": ObjectId(user_id)}, {"name": 1, "email": 1, "role": 1})
        if not user:
            return jsonify({"message": "User not found"}), 404

        user["_id"] = str(user["_id"])
        return jsonify(user), 200

    except Exception as e:
        print(f"Error fetching user: {e}")  # Log any errors
        return jsonify({"message": "Error fetching user"}), 500


@api.route('/classes', methods=['GET'])
def get_classes():
    db = current_app.db
    classes = db.classes.find() 
    result = [{'_id': str(item['_id']), 'title': item['title'], 'subTopic': item['subTopic']} for item in classes]
    return jsonify(result), 200

@api.route('/classes', methods=['POST'])
def add_class():
    db = current_app.db
    data = request.get_json()
    db.classes.insert_one(data)
    return jsonify({'message': 'Class added successfully'}), 201
