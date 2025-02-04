def setup_performance_collections(db):
    """
    Set up the performance-related collections with updated indexes and validations.
    """
    # Create Performance_Analysis collection indexes
    db.Performance_Analysis.create_index([
        ("student_id", 1),
        ("created_at", -1)
    ])
    db.Performance_Analysis.create_index([
        ("student_id", 1),
        ("sequence_attempts", 1)  # Add index for sequence lookup
    ])
    db.Performance_Analysis.create_index([
        ("prediction.will_improve", 1),
        ("created_at", -1)
    ])

    # Create Performance_Metrics collection indexes
    db.Performance_Metrics.create_index([
        ("student_id", 1),
        ("topic", 1),
        ("time_period.end", -1)
    ])
    db.Performance_Metrics.create_index([
        ("student_id", 1),
        ("created_at", -1)
    ])

    # Create validation rules for Performance_Analysis
    db.command({
        "collMod": "Performance_Analysis",
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": [
                    "student_id", 
                    "prediction", 
                    "analysis", 
                    "sequence_attempts",  
                    "created_at"
                ],
                "properties": {
                    "student_id": {"bsonType": "objectId"},
                    "sequence_attempts": {  
                        "bsonType": "array",
                        "items": {"bsonType": "string"}
                    },
                    "prediction": {
                        "bsonType": "object",
                        "required": ["will_improve", "confidence", "prediction_score", "timestamp"],
                        "properties": {
                            "will_improve": {"bsonType": "bool"},
                            "confidence": {"bsonType": "double"},
                            "prediction_score": {"bsonType": "double"},
                            "timestamp": {"bsonType": "date"}
                        }
                    },
                    "analysis": {
                        "bsonType": "object",
                        "required": ["learning_trends", "recommendations"],
                        "properties": {
                            "learning_trends": {
                                "bsonType": "object",
                                "required": ["time_efficiency", "consistency", "average_correctness"],  # Add average_correctness
                                "properties": {
                                    "time_efficiency": {"bsonType": "string"},
                                    "consistency": {"bsonType": "double"},
                                    "average_correctness": {"bsonType": "double"}  # New field
                                }
                            },
                            "recommendations": {
                                "bsonType": "array",
                                "items": {"bsonType": "string"}
                            }
                        }
                    },
                    "created_at": {"bsonType": "date"}
                }
            }
        }
    })

    # Create validation rules for Performance_Metrics
    db.command({
        "collMod": "Performance_Metrics",
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["student_id", "topic", "metrics", "time_period", "created_at"],
                "properties": {
                    "student_id": {"bsonType": "objectId"},
                    "topic": {"bsonType": "string"},
                    "sub_topic": {"bsonType": "string"},  
                    "metrics": {
                        "bsonType": "object",
                        "required": [
                            "average_score",  # Add average_score
                            "average_time_per_step", 
                            "accuracy_rate",
                            "completion_rate",
                            "improvement_rate"
                        ],
                        "properties": {
                            "average_score": {"bsonType": "double"},  # New field
                            "average_time_per_step": {"bsonType": "double"},
                            "accuracy_rate": {"bsonType": "double"},
                            "completion_rate": {"bsonType": "double"},
                            "improvement_rate": {"bsonType": "double"}
                        }
                    },
                    "time_period": {
                        "bsonType": "object",
                        "required": ["start", "end"],
                        "properties": {
                            "start": {"bsonType": "date"},
                            "end": {"bsonType": "date"}
                        }
                    },
                    "created_at": {"bsonType": "date"},
                    "attempt_count": {"bsonType": "int"}
                }
            }
        }
    })
