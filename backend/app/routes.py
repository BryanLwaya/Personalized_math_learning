import random
import string
from flask import Blueprint, jsonify, current_app, request
from bson.objectid import ObjectId
from random import shuffle
from datetime import datetime, timezone
import os

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


@api.route('/class/<class_id>', methods=['GET'])
def get_class_details(class_id):
    db = current_app.db
    class_data = db.Classes.find_one({"_id": ObjectId(class_id)})

    if class_data:
        class_dict = {
            "_id": str(class_data["_id"]),
            "class_name": class_data.get("class_name"),
            "teacher_id": str(class_data.get("teacher_id")) if class_data.get("teacher_id") else None,
            "classcode": class_data.get("classcode"),
            "students": [str(student_id) for student_id in class_data.get("students", [])]
        }
        return jsonify(class_dict), 200
    
    return jsonify({"message": "Class not found"}), 404
   

@api.route('/tasks/<class_id>', methods=['GET'])
def get_tasks_by_class(class_id):
    """
    Fetch all tasks for a specific class by class_id.
    """
    db = current_app.db
    try:
        tasks = db.Tasks.find({"class_id": ObjectId(class_id)})
        task_list = [{"_id": str(task["_id"]),
                      "class_id": str(task["class_id"]),
                      "title": task["title"],
                      "topic": task["topic"], 
                      "sub_topic": task.get("sub_topic", ""),
                      "description": task.get("description", ""), 
                      "created_at": task.get("created_at", "")} for task in tasks]

        return jsonify(task_list), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@api.route('/topics', methods=['GET'])
def get_topics():
    """
    Fetch all topics from the Topics collection.
    """
    db = current_app.db
    try:
        topics = db.Topics.find()
        result = []
        for topic in topics:
            result.append({
                "_id": str(topic["_id"]),
                "topic_name": topic["topic_name"],
                "subtopics": topic["subtopics"]  # Subtopics is a list of objects with subtopic_name and objective
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/task/<task_id>', methods=['GET'])
def get_task_details(task_id):
    """
    Fetch details of a specific task based on its ID.
    """
    db = current_app.db
    try:
        # Fetch the task by ID
        task = db.Tasks.find_one({"_id": ObjectId(task_id)})
        if not task:
            return jsonify({"message": "Task not found"}), 404

        # Convert ObjectId fields to strings
        task["_id"] = str(task["_id"])
        task["class_id"] = str(task["class_id"])

        return jsonify(task), 200
    except Exception as e:
        print("Error fetching task details:", e)
        return jsonify({"message": "Failed to fetch task details", "error": str(e)}), 500
    

@api.route('/comments/<class_id>', methods=['GET'])
def get_comments_by_class_id(class_id):
    """
    Retrieve all comments associated with a specific class_id, including student names.
    """
    db = current_app.db
    try:
        # Find comments by class_id
        comments = list(db.Comments.find({"class_id": ObjectId(class_id)}))

        # Prepare a list of student IDs to fetch their names
        student_ids = {comment["student_id"] for comment in comments}
        students = db.Users.find({"_id": {"$in": list(student_ids)}}, {"_id": 1, "name": 1})

        # Map student IDs to their names
        student_map = {str(student["_id"]): student["name"] for student in students}

        # Format comments for JSON response, including student names
        for comment in comments:
            comment["_id"] = str(comment["_id"])
            comment["student_id"] = str(comment["student_id"])
            comment["class_id"] = str(comment["class_id"])
            comment["created_at"] = comment["created_at"].isoformat()
            comment["student_name"] = student_map.get(comment["student_id"], "Unknown")  # Default to "Unknown"

        return jsonify(comments), 200
    except Exception as e:
        print(f"Error retrieving comments: {e}")
        return jsonify({"message": "Error retrieving comments", "error": str(e)}), 500
