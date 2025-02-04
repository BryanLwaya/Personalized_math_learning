import string
import random
from flask import Blueprint, jsonify, current_app, request
from bson.objectid import ObjectId
from datetime import datetime, timezone

teacher_api = Blueprint('teacher_api', __name__)


@teacher_api.route('/classes/<teacher_id>', methods=['GET'])
def get_classes(teacher_id):
    """
    Fetch all classes associated with a teacher's ID.
    """
    try:
        db = current_app.db
        classes = list(db.Classes.find({"teacher_id": ObjectId(teacher_id)}))
        for class_item in classes:
            class_item["_id"] = str(class_item["_id"])
            class_item["teacher_id"] = str(class_item["teacher_id"])
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({"message": "Error fetching classes", "error": str(e)}), 500


@teacher_api.route('/teacher/dashboard/<teacher_id>', methods=['GET'])
def get_teacher_dashboard(teacher_id):
    """
    Fetch dashboard data for a specific teacher:
    - All classes taught by the teacher
    - All students enrolled in these classes
    - All tasks associated with these classes
    """
    db = current_app.db
    try:
        # Fetch all classes taught by the teacher
        classes = list(db.Classes.find({"teacher_id": ObjectId(teacher_id)}))
        for class_item in classes:
            class_item["_id"] = str(class_item["_id"])
            class_item["teacher_id"] = str(class_item["teacher_id"])

        class_ids = [ObjectId(class_item["_id"]) for class_item in classes]

        # Fetch all students enrolled in these classes
        enrollments = list(db.Enrollments.find({"class_id": {"$in": class_ids}}))
        student_ids = list(set(enrollment["student_id"] for enrollment in enrollments))
        students = list(
            db.Users.find({"_id": {"$in": student_ids}}, {"name": 1, "email": 1})
        )
        for student in students:
            student["_id"] = str(student["_id"])

        # Fetch all tasks associated with these classes
        tasks = list(db.Tasks.find({"class_id": {"$in": class_ids}}))
        for task in tasks:
            task["_id"] = str(task["_id"])
            task["class_id"] = str(task["class_id"])

        # Prepare the response
        dashboard_data = {
            "classes": classes,
            "students": students,
            "tasks": tasks
        }

        return jsonify(dashboard_data), 200

    except Exception as e:
        print(f"Error fetching teacher dashboard data: {e}")
        return jsonify({"message": "Error fetching dashboard data", "error": str(e)}), 500


def generate_class_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))


@teacher_api.route("/create-class", methods=["POST"])
def create_class():
    """
    Endpoint to create a class.
    """
    data = request.json
    teacher_id = data.get("teacher_id")
    class_name = data.get("class_name")

    if not teacher_id or not class_name:
        return jsonify({"message": "Teacher ID and Class Name are required"}), 400

    db = current_app.db

    # Generate unique class code
    class_code = generate_class_code()

    new_class = {
        "class_name": class_name,
        "teacher_id": ObjectId(teacher_id),
        "classcode": class_code,
        "created_at": datetime.now(timezone.utc)
    }

    try:
        db.Classes.insert_one(new_class)
        new_class["_id"] = str(new_class["_id"])
        new_class["teacher_id"] = str(new_class["teacher_id"])
        return jsonify({
            "message": "Class Created Successfully!",
            "class_name": class_name,
            "classcode": class_code
        }), 201
    except Exception as e:
        return jsonify({"message": "Error creating class", "error": str(e)}), 500


@teacher_api.route('/class/<class_id>', methods=['DELETE'])
def delete_class(class_id):
    """
    Delete a class by its ID and remove associated records from Enrollments, Tasks, and Task_Attempts.
    """
    db = current_app.db
    try:
        # Find the class to ensure it exists
        class_data = db.Classes.find_one({"_id": ObjectId(class_id)})
        if not class_data:
            return jsonify({"message": "Class not found"}), 404

        # Delete related tasks and collect their IDs
        deleted_task_ids = []
        tasks = db.Tasks.find({"class_id": ObjectId(class_id)})
        for task in tasks:
            deleted_task_ids.append(task["_id"])  # Collect task IDs
        task_result = db.Tasks.delete_many({"class_id": ObjectId(class_id)})
        print(f"Deleted {task_result.deleted_count} tasks related to the class.")

        # Delete task attempts for the deleted tasks
        if deleted_task_ids:
            task_attempt_result = db.Task_Attempts.delete_many({"task_id": {"$in": deleted_task_ids}})
            print(f"Deleted {task_attempt_result.deleted_count} task attempts related to the deleted tasks.")

        # Delete related enrollments
        enrollment_result = db.Enrollments.delete_many({"class_id": ObjectId(class_id)})
        print(f"Deleted {enrollment_result.deleted_count} enrollments related to the class.")

        # Delete the class
        db.Classes.delete_one({"_id": ObjectId(class_id)})

        return jsonify({"message": "Class records deleted successfully."}), 200

    except Exception as e:
        print(f"Error deleting class: {e}")
        return jsonify({"message": "Error deleting class", "error": str(e)}), 500



@teacher_api.route('/class/<class_id>/students', methods=['GET'])
def get_enrolled_students(class_id):
    """
    Fetch all students enrolled in a specific class.
    """
    db = current_app.db
    try:
        enrollments = list(db.Enrollments.find({"class_id": ObjectId(class_id)}))
        student_ids = [enrollment["student_id"] for enrollment in enrollments]

        students = list(
            db.Users.find({"_id": {"$in": student_ids}}, {"name": 1, "email": 1})
        )
        for student in students:
            student["_id"] = str(student["_id"])

        return jsonify({"students": students}), 200
    except Exception as e:
        print(f"Error fetching students: {e}")
        return jsonify({"message": "Error fetching students", "error": str(e)}), 500



@teacher_api.route("/tasks/add-task", methods=["POST"])
def create_task():
    """
    Create a new task for a class.
    """
    db = current_app.db
    try:
        data = request.get_json()
        title = data.get("title")
        class_id = data.get("class_id")
        topic = data.get("topic")
        sub_topic = data.get("sub_topic")
        description = data.get("description")

        if not class_id or not topic or not sub_topic or not description:
            return jsonify({"error": "Missing required fields"}), 400

        task = {
            "class_id": ObjectId(class_id),
            "title": title,
            "topic": topic,
            "sub_topic": sub_topic,
            "description": description,
            "created_at": datetime.now(timezone.utc),
        }

        result = db.Tasks.insert_one(task)
        return jsonify({"message": "Task created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@teacher_api.route('/task/<task_id>', methods=['PUT'])
def update_task(task_id):
    """
    Update a task's title and description.
    """
    db = current_app.db
    data = request.json

    # Validate input
    title = data.get("title")
    description = data.get("description")
    if not title or not description:
        return jsonify({"message": "Title and description are required"}), 400

    try:
        # Update the task
        result = db.Tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"title": title, "description": description}}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Task not found"}), 404

        return jsonify({"message": "Task updated successfully"}), 200
    except Exception as e:
        print(f"Error updating task: {e}")
        return jsonify({"message": "Error updating task", "error": str(e)}), 500


@teacher_api.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """
    Delete a task by its ID and remove associated task_attempts.
    """
    db = current_app.db
    try:
        # Step 1: Find the task to ensure it exists
        task_data = db.Tasks.find_one({"_id": ObjectId(task_id)})
        if not task_data:
            return jsonify({"message": "Task not found"}), 404

        # Step 2: Delete the task
        task_result = db.Tasks.delete_one({"_id": ObjectId(task_id)})
        print(f"Deleted {task_result.deleted_count} task(s).")

        # Step 3: Delete related task attempts
        task_attempt_result = db.Task_Attempts.delete_many({"task_id": ObjectId(task_id)})
        print(f"Deleted {task_attempt_result.deleted_count} task attempts related to the task.")

        return jsonify({"message": "Task deleted successfully."}), 200

    except Exception as e:
        print(f"Error deleting task: {e}")
        return jsonify({"message": "Error deleting task", "error": str(e)}), 500


@teacher_api.route('/comments/add', methods=['POST'])
def add_comment():
    """
    Add a comment to the Comments collection.
    """
    db = current_app.db
    data = request.json

    # Validate input
    student_id = data.get("student_id")
    class_id = data.get("class_id")
    caption = data.get("caption")
    comment = data.get("comment")

    if not student_id or not class_id or not caption or not comment:
        return jsonify({"message": "All fields are required"}), 400

    try:
        comment_entry = {
            "student_id": ObjectId(student_id),
            "class_id": ObjectId(class_id),
            "caption": caption,
            "comment": comment,
            "created_at": datetime.now(timezone.utc),
        }
        db.Comments.insert_one(comment_entry)
        return jsonify({"message": "Comment added successfully"}), 201

    except Exception as e:
        print(f"Error adding comment: {e}")
        return jsonify({"message": "Error adding comment", "error": str(e)}), 500
