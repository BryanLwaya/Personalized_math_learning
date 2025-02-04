import json
from pymongo import MongoClient
from bson.objectid import ObjectId

# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection URI
db = client["MathGoalDB"]  # Replace with your database name
questions_collection = db["Questions"]  # Questions collection
task_attempts_collection = db["Task_Attempts"]  # Task_Attempts collection

# Function to load and process data
def process_and_store_data(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)
    
    # Drop records with null or empty step_data
    cleaned_data = []
    for record in data:
        steps = record.get("steps", [])
        if steps and isinstance(steps, list):  # Keep only records with non-empty steps
            cleaned_data.append(record)

    print(f"Total records processed: {len(data)}")
    print(f"Total valid records: {len(cleaned_data)}")

    # Store processed data in MongoDB
    store_data_in_mongodb(cleaned_data)


# Function to store data in MongoDB
def store_data_in_mongodb(cleaned_data):
    for record in cleaned_data:
        question = record["question"]
        steps = record["steps"]

        # Insert question into Questions collection
        question_doc = {
            "_id": ObjectId(),  # Generate a new ObjectId
            "question": question["text"],
            "topic": question["topic"],
            "sub_topic": question["sub_topic"],
            "learning_objective": question.get("learning_objective", ""),
            "steps": [
                {
                    "step_number": step["step_number"],
                    "step_template": step["step_template"],
                    "correct_answer": step["correct_answer"]
                }
                for step in steps
            ],
        }
        question_id = questions_collection.insert_one(question_doc).inserted_id

        # Insert task attempt into Task_Attempts collection
        task_attempt_doc = {
            "task_id": None,  # Update with a valid Task ID if available
            "student_id": record["student_id"],
            "question_id": question_id,
            "stages": [
                {
                    "step_number": step["step_number"],
                    "student_answer": step["student_answer"],
                    "correct_answer": step["correct_answer"],
                    "time_taken": step["time_taken"]
                }
                for step in steps
            ],
            "total_steps": len(steps),
            "total_correct": sum(1 for step in steps if step["student_answer"] == step["correct_answer"]),
            "total_time_taken": record["total_time"]
        }
        task_attempts_collection.insert_one(task_attempt_doc)

    print("Data successfully stored in MongoDB.")


if __name__ == "__main__":
    # Replace with the path to your student_processed_data.json file
    file_path = "student_progress_data.json"
    process_and_store_data(file_path)