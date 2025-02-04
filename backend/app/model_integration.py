from flask import jsonify
import tensorflow as tf
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import json
from datetime import datetime

class LearningProgressPredictor:
    def __init__(self, model_path):
        """
        Initialize the predictor with a trained model.
        
        Args:
            model_path: Path to the saved model
        """
        self.model = tf.keras.models.load_model(model_path)
        self.scaler = MinMaxScaler()
        self.sequence_length = 3  
        
    def process_attempt_data(self, attempt_data):
        """
        Process a single attempt record into the format needed for prediction.
        
        Args:
            attempt_data: Dictionary containing attempt information
        """
        processed_features = []
        
        for question in attempt_data['answers']:
            # Calculate average time per step
            step_times = [step['time_taken'] for step in question['steps']]
            avg_time = np.mean(step_times)
            time_consistency = np.std(step_times) / (avg_time + 1e-6)
            
            features = [
                avg_time,
                time_consistency,
                len(question['steps']),
                question['total_time']
            ]
            processed_features.append(features)
            
        return processed_features
    
    def get_student_history(self, student_id, db_connection):
        """
        Retrieve student's previous attempts from database.
        This is a placeholder - implement according to your database structure.
        
        Args:
            student_id: Student's ID
            db_connection: Database connection object
        """
        # Query last 4 attempts (we need 5 total including current)
        previous_attempts = db_connection.find({
            'student_id': student_id
        }).sort('created_at', -1).limit(4)
        
        return previous_attempts
    
    def prepare_sequence(self, current_attempt, previous_attempts):
        """
        Prepare a sequence of attempts for prediction, ensuring consistent sequence length.
        
        Args:
            current_attempt: Current attempt data
            previous_attempts: List of previous attempts

        """
        sequence = []
        attempts_to_process = []
        
        # Add previous attempts
        if previous_attempts:
            attempts_to_process.extend(previous_attempts)
        
        # Add current attempt
        attempts_to_process.append(current_attempt)
        
        # Process only the most recent attempts up to sequence_length
        for attempt in attempts_to_process[-self.sequence_length:]:
            # Process all questions in this attempt
            attempt_features = []
            for question in attempt['answers']:
                # Calculate features for this question
                step_times = [step['time_taken'] for step in question['steps']]
                if not step_times:
                    continue
                    
                avg_time = np.mean(step_times)
                time_consistency = np.std(step_times) / (avg_time + 1e-6)
                
                question_features = [
                    avg_time,
                    time_consistency,
                    len(question['steps']),
                    question['total_time']
                ]
                attempt_features.append(question_features)
            
            # If we have features for this attempt, add their average
            if attempt_features:
                avg_attempt_features = np.mean(attempt_features, axis=0)
                sequence.append(avg_attempt_features)
        
        # Check if we have enough data
        if len(sequence) < self.sequence_length:
            print(f"Insufficient sequence length: {len(sequence)}")
            return jsonify({"message": "Insufficient sequence length: {len(sequence)}"}), 404
        
        # Ensure exact sequence length by taking most recent
        sequence = sequence[-self.sequence_length:]
        
        # Convert to numpy array and reshape for model input
        sequence_array = np.array([sequence])
        print("Final Sequence Shape:", sequence_array.shape)
        
        return sequence_array

    
    def predict_improvement(self, sequence):
        """
        Make prediction using the model.
        
        Args:
            sequence: Preprocessed sequence of attempts
        
        Returns:
            Dictionary containing prediction results and confidence
        """
        # Scale the sequence
        sequence_reshaped = sequence.reshape(-1, sequence.shape[-1])
        sequence_scaled = self.scaler.fit_transform(sequence_reshaped).reshape(sequence.shape)
        
        # Get model prediction
        prediction = self.model.predict(sequence_scaled)[0][0]
        
        # Create detailed result
        result = {
            'will_improve': bool(prediction > 0.5),
            'confidence': float(abs(prediction - 0.5) * 2),  
            'prediction_score': float(prediction),
            'timestamp': datetime.now().isoformat()
        }
        
        return result
    
    def analyze_learning_patterns(self, sequence, prediction):
        """
        Analyze learning patterns based on the sequence and prediction.
        
        Args:
            sequence: The attempt sequence used for prediction
            prediction: The model's prediction result
        """
        # Calculate trend indicators
        times = [np.mean(attempt) for attempt in sequence[0]]
        time_trend = np.polyfit(range(len(times)), times, 1)[0]
        
        analysis = {
            'learning_trends': {
                'time_efficiency': 'Improving' if time_trend < 0 else 'Needs Attention',
                'consistency': np.std(times)
            },
            'recommendations': []
        }
        
        # Generate recommendations based on patterns
        if time_trend > 0:
            analysis['recommendations'].append(
                "Consider reviewing previous topics because the time you take to answer questions is increasing"
            )
        if np.std(times) > np.mean(times) * 0.5:
            analysis['recommendations'].append(
                "Work on maintaining consistent performance across different questions"
            )
            
        return analysis


def integrate_with_system(attempt_data, db_connection, model_path='student_progress_model.h5'):
    """
    Main function to integrate with your system.
    
    Args:
        attempt_data: Current attempt data from your system
        db_connection: Database connection object
        model_path: Path to saved model
    """
    # Initialize predictor
    predictor = LearningProgressPredictor(model_path)
    
    # Get student history
    student_id = attempt_data['student_id']
    previous_attempts = predictor.get_student_history(student_id, db_connection)
    
    # Prepare sequence
    sequence = predictor.prepare_sequence(attempt_data, previous_attempts)
    
    if sequence is None:
        return {
            'status': 'insufficient_data',
            'message': 'Need more attempts for prediction'
        }
    
    # Make prediction
    prediction = predictor.predict_improvement(sequence)
    
    # Analyze patterns
    analysis = predictor.analyze_learning_patterns(sequence, prediction)
    
    # Combine results
    result = {
        'status': 'success',
        'prediction': prediction,
        'analysis': analysis,
        'student_id': student_id,
        'timestamp': datetime.now().isoformat()
    }
    
    return result