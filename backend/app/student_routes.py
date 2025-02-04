import string
from flask import Blueprint, jsonify, current_app, request
from bson.objectid import ObjectId
from datetime import datetime, timezone
from random import shuffle
import os

student_api = Blueprint('student_api', __name__)

@student_api.route("/enrollments/join", methods=["POST"])
def join_class():
    """
    Enroll a student into a class using the class code.
    """
    db = current_app.db
    data = request.get_json()
    student_id = data.get("student_id")
    class_code = data.get("class_code")

    if not student_id or not class_code:
        return jsonify({"message": "Student ID and Class Code are required"}), 400

    class_data = db.Classes.find_one({"classcode": class_code})

    if not class_data:
        return jsonify({"message": "Invalid class code"}), 400

    existing_enrollment = db.Enrollments.find_one({
        "student_id": ObjectId(student_id),
        "class_id": class_data["_id"]
    })

    if existing_enrollment:
        return jsonify({"message": "Student is already enrolled in this class"}), 400

    enrollment = {
        "student_id": ObjectId(student_id),
        "class_id": class_data["_id"],
        "teacher_id": class_data["teacher_id"],
        "enrolled_at": datetime.utcnow(),
    }

    db.Enrollments.insert_one(enrollment)
    return jsonify({"message": "Successfully enrolled in the class"}), 201


@student_api.route("/enrollments/<student_id>", methods=["GET"])
def get_enrolled_classes(student_id):
    """
    Fetch all classes a student is enrolled in.
    """
    db = current_app.db
    try:
        enrollments = db.Enrollments.find({"student_id": ObjectId(student_id)})
        class_ids = [enrollment["class_id"] for enrollment in enrollments]

        classes = list(db.Classes.find({"_id": {"$in": class_ids}}))

        for cls in classes:
            teacher = db.Users.find_one({"_id": cls["teacher_id"]})
            cls["teacher_name"] = teacher["name"] if teacher else "Unknown"
            cls["teacher_id"] = str(cls["teacher_id"])
            cls["_id"] = str(cls["_id"])

        return jsonify(classes), 200
    except Exception as e:
        print("Error fetching enrolled classes:", e)
        return jsonify({"message": "Failed to fetch enrolled classes"}), 500
 

@student_api.route('/task/<task_id>/questions', methods=['GET'])
def get_random_questions(task_id):
    """
    Fetch questions for a task, filtered by topic and sub_topic, and 4 questions.
    """
    db = current_app.db
    try:
        task = db.Tasks.find_one({"_id": ObjectId(task_id)})
        if not task:
            return jsonify({"message": "Task not found"}), 404

        topic, sub_topic = task["topic"], task["sub_topic"]
        questions = list(db.Questions.find({"topic": topic, "sub_topic": sub_topic}))
        shuffle(questions)
        selected_questions = questions[:2]

        for question in selected_questions:
            question["_id"] = str(question["_id"])
        return jsonify({"questions": selected_questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@student_api.route('/submit_attempt', methods=['POST'])
def submit_task_attempt():
    """
    Save the student's task attempt with answers.
    """
    db = current_app.db
    data = request.json
    task_id = data.get("task_id")
    student_id = data.get("student_id")
    answers = data.get("answers", [])

    if not task_id or not student_id or not answers:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        total_time_taken = sum(ans["total_time"] for ans in answers)
        total_correct = sum(ans["correct_count"] for ans in answers)

        task_attempt = {
            "task_id": ObjectId(task_id),
            "student_id": ObjectId(student_id),
            "answers": answers,
            "total_time_taken": total_time_taken,
            "total_correct": total_correct,
            "created_at": datetime.now(timezone.utc),
        }

        results = db.Task_Attempts.insert_one(task_attempt)

        return jsonify({"message": "Attempt submitted successfully", "attempt_id": str(results.inserted_id)}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@student_api.route('/attempt/<attempt_id>', methods=['GET'])
def get_attempt_details(attempt_id):
    """
    Fetch attempt details along with step-level information for each question.
    """
    db = current_app.db
    try:
        # Fetch the attempt
        attempt = db.Task_Attempts.find_one({"_id": ObjectId(attempt_id)})
        if not attempt:
            return jsonify({"message": "Attempt not found"}), 404

        # Fetch question details for each question in the attempt
        questions = []
        for answer in attempt['answers']:
            question = db.Questions.find_one({"_id": ObjectId(answer['question_id'])})
            if not question:
                continue

            # Prepare detailed step data
            detailed_steps = []
            for step in question['steps']:
                # Find the student's answer for this step
                student_step = next(
                    (s for s in answer['steps'] if s['step_number'] == step['step_number']),
                    {}
                )
                detailed_steps.append({
                    "step_number": step['step_number'],
                    "step_template": step['step_template'],
                    "correct_answer": step['correct_answer'],
                    "student_answer": student_step.get('student_answer', None),
                })

            questions.append({
                "question_text": question['question'],
                "steps": detailed_steps,
            })

        # Prepare the response
        return jsonify({
            "attempt_id": str(attempt["_id"]),
            "student_id": str(attempt["student_id"]),
            "task_id": str(attempt["task_id"]),
            "questions": questions,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500