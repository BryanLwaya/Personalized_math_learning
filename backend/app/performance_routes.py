import string
from flask import Blueprint, jsonify, current_app, request
from bson.objectid import ObjectId
from datetime import datetime, timezone
from app.model_integration import LearningProgressPredictor
import os

performance_api = Blueprint('performance_api', __name__)


@performance_api.route('/performance/analysis/<student_id>', methods=['GET'])
def get_student_performance(student_id):
    """
    Fetch performance analysis and metrics for a specific student.
    """
    db = current_app.db
    try:
        # Fetch latest performance analysis
        performance_data = db.Performance_Analysis.find_one(
            {"student_id": ObjectId(student_id)}, sort=[("created_at", -1)]
        )

        if not performance_data:
            return jsonify({"message": "No performance analysis found", "has_data": False}), 404

        # Convert ObjectId and datetime fields for JSON serialization
        performance_data["_id"] = str(performance_data["_id"])
        performance_data["student_id"] = str(performance_data["student_id"])
        performance_data["created_at"] = performance_data["created_at"].isoformat()

        # Fetch performance metrics
        performance_metrics = list(db.Performance_Metrics.find(
            {"student_id": ObjectId(student_id)}
        ))

        for metric in performance_metrics:
            metric["_id"] = str(metric["_id"])
            metric["student_id"] = str(metric["student_id"])
            metric["time_period"]["start"] = metric["time_period"]["start"].isoformat()
            metric["time_period"]["end"] = metric["time_period"]["end"].isoformat()
            metric["created_at"] = metric["created_at"].isoformat()

        return jsonify({
            "has_data": True,
            "performance": performance_data,
            "metrics": performance_metrics
        }), 200

    except Exception as e:
        print(f"Error fetching student performance: {e}")
        return jsonify({"message": "Error fetching student performance", "error": str(e)}), 500



@performance_api.route('/student/performance/<student_id>', methods=['GET'])
def analyze_student_performance(student_id):
    db = current_app.db
    try:
        # Get all attempts ordered by date
        attempts = list(db.Task_Attempts.find(
            {"student_id": ObjectId(student_id)}
        ).sort("created_at", -1))

        if not attempts:
            return jsonify({
                "message": "No attempts found for this student",
                "has_prediction": False
            }), 404

        # Get latest performance analysis
        latest_analysis = db.Performance_Analysis.find_one({
            "student_id": ObjectId(student_id)
        }, sort=[("created_at", -1)])

        # Check if we need new analysis
        needs_new_analysis = True
        if latest_analysis:
            analyzed_attempts = set(latest_analysis['sequence_attempts'])
            current_sequence = set(str(attempt['_id']) for attempt in attempts[:3])
            needs_new_analysis = analyzed_attempts != current_sequence

        if not needs_new_analysis:
            for attempt in attempts:
                attempt['_id'] = str(attempt['_id'])
                attempt['student_id'] = str(attempt['student_id'])
                attempt['task_id'] = str(attempt['task_id'])


            return jsonify({
                "attempts": attempts,
                "has_prediction": True,
                "prediction": latest_analysis['prediction'],
                "analysis": latest_analysis['analysis'],
                "timestamp": latest_analysis['created_at'].isoformat()
            }), 200

        # New analysis needed
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_file = os.path.join(current_dir, 'student_progress_model.h5')
        predictor = LearningProgressPredictor(model_file)

        latest_attempt = attempts[0]
        previous_attempts = attempts[1:3]
        sequence = predictor.prepare_sequence(latest_attempt, previous_attempts)
        print("Sequence Prepared")

        if sequence is None:
            for attempt in attempts:
                attempt['_id'] = str(attempt['_id'])
                attempt['student_id'] = str(attempt['student_id'])
                attempt['task_id'] = str(attempt['task_id'])

            return jsonify({
                "message": "Insufficient attempt history for prediction",
                "attempts": attempts,
                "has_prediction": False
            }), 200

        print("Starting Prediction")
        prediction = predictor.predict_improvement(sequence)
        print("Prediction Successful")
        analysis = predictor.analyze_learning_patterns(sequence, prediction)
        print("Pattern Analysis Successful")

        # Calculate average correctness for learning trends
        total_correct_steps = sum(
            step.get('student_answer') == step.get('correct_answer')
            for attempt in attempts
            for question in attempt['answers']
            for step in question['steps']
        )
        total_attempted_steps = sum(
            1 for attempt in attempts for question in attempt['answers'] for step in question['steps']
        )
        average_correctness = total_correct_steps / total_attempted_steps if total_attempted_steps > 0 else 0

        analysis["learning_trends"]["average_correctness"] = average_correctness

        # Save new performance analysis
        prediction['timestamp'] = datetime.now(timezone.utc)
        performance_record = {
            "student_id": ObjectId(student_id),
            "prediction": prediction,
            "analysis": analysis,
            "sequence_attempts": [str(attempt['_id']) for attempt in attempts[:3]],
            "created_at": datetime.now(timezone.utc)
        }
        db.Performance_Analysis.insert_one(performance_record)

        # Update Performance Metrics by topic
        current_time = datetime.now(timezone.utc)
        
        # Group attempts by topic
        topic_attempts = {}
        for attempt in attempts:
            # Get task details to get topic information
            task = db.Tasks.find_one({"_id": ObjectId(attempt['task_id'])})
            if not task:
                continue
                
            topic = task['topic']
            sub_topic = task.get('sub_topic', '')
            
            if topic not in topic_attempts:
                topic_attempts[topic] = {
                    'attempts': [],
                    'sub_topic': sub_topic
                }
            topic_attempts[topic]['attempts'].append(attempt)

        # Calculate and store metrics for each topic
        for topic, data in topic_attempts.items():
            sub_topic = data['sub_topic']
            topic_metrics = calculate_topic_metrics(data['attempts'])

            existing_metrics = db.Performance_Metrics.find_one({
                "student_id": ObjectId(student_id),
                "topic": topic,
                "sub_topic": sub_topic,
                "time_period.end": None
            })

            if existing_metrics:
                db.Performance_Metrics.update_one(
                    {"_id": existing_metrics["_id"]},
                    {
                        "$set": {
                            "metrics": topic_metrics,
                            "time_period.end": current_time,
                            "attempt_count": len(data['attempts']),
                        }
                    }
                )
            else:
                metrics_record = {
                    "student_id": ObjectId(student_id),
                    "topic": topic,
                    "sub_topic": sub_topic,
                    "metrics": topic_metrics,
                    "time_period": {
                        "start": data['attempts'][-1]['created_at'],  # Earliest attempt
                        "end": current_time
                    },
                    "attempt_count": len(data['attempts']),
                    "created_at": current_time
                }
                db.Performance_Metrics.insert_one(metrics_record)


        return jsonify({
            "has_prediction": True,
            "message": "Performance Analyzed Successfully",
        }), 200

    except Exception as e:
        print(f"Error analyzing student performance: {e}")
        return jsonify({"message": "Error analyzing performance", "error": str(e)}), 500

def calculate_topic_metrics(attempts):
    """
    Calculate performance metrics for a set of attempts on a specific topic.
    """
    total_time = 0
    total_steps = 0
    correct_steps = 0
    completion_count = 0
    times_per_step = []
    scores = []
    
    # Sort attempts by date to calculate improvement
    attempts = sorted(attempts, key=lambda x: x['created_at'])
    
    # Process each attempt
    for attempt in attempts:
        completion_count += 1
        
        for question in attempt['answers']:
            question_score = sum(
                step.get('student_answer') == step.get('correct_answer')
                for step in question['steps']
            ) / len(question['steps'])
            scores.append(question_score)

            for step in question['steps']:
                total_steps += 1
                total_time += step['time_taken']
                times_per_step.append(step['time_taken'])
                if step.get('student_answer') == step.get('correct_answer'):
                    correct_steps += 1

    # Calculate improvement rate
    if len(attempts) >= 2:
        first_times = [step['time_taken'] for question in attempts[0]['answers'] 
                    for step in question['steps']]
        last_times = [step['time_taken'] for question in attempts[-1]['answers'] 
                    for step in question['steps']]
        avg_first = sum(first_times) / len(first_times) if first_times else 0
        avg_last = sum(last_times) / len(last_times) if last_times else 0
        improvement_rate = float((avg_first - avg_last) / avg_first) if avg_first > 0 else 0.0
    else:
        improvement_rate = 0.0


    return {
    "average_score": float(sum(scores) / len(scores)) if scores else 0.0,
    "average_time_per_step": float(total_time / total_steps) if total_steps > 0 else 0.0,
    "accuracy_rate": float(correct_steps / total_steps) if total_steps > 0 else 0.0,
    "completion_rate": float(completion_count / len(attempts)) if attempts else 0.0,
    "improvement_rate": improvement_rate
}

