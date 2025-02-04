import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

class TimeSeriesProgressTransformer:
    def __init__(self, math_dataset, student_data):
        self.math_df = math_dataset
        self.student_df = student_data
        self.combined_data = []
    
    def _convert_to_serializable(self, obj):
        """
        Convert NumPy types to Python native types for JSON serialization.
        This ensures all data can be properly saved to JSON.
        """
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return obj
    
    def _process_record(self, record):
        """
        Process a single record to ensure all values are JSON serializable.
        """
        if isinstance(record, dict):
            return {key: self._process_record(value) for key, value in record.items()}
        elif isinstance(record, list):
            return [self._process_record(item) for item in record]
        return self._convert_to_serializable(record)
    
    def structure_question_steps(self, row):
        solution_steps = str(row['Solution']).split('\n')
        structured_steps = []
        
        for step in solution_steps:
            if not step.strip():
                continue
            
            numbers = [n for n in step.split() if n.replace('.', '').isdigit()]
            if numbers:
                final_answer = numbers[-1]
                template = step.rsplit(final_answer, 1)
                if len(template) > 1:
                    structured_steps.append({
                        'step_template': template[0].strip() + '___' + template[1].strip(),
                        'correct_answer': final_answer,
                        'step_explanation': step.strip()
                    })
        
        # Convert row.name to standard Python int if it's a NumPy type
        question_id = int(row.name) if isinstance(row.name, np.integer) else row.name
        
        return {
            'question_id': question_id,
            'question_text': str(row['Question']),
            'solution': structured_steps,
            'topic': str(row['Topic']),
            'sub_topic': str(row['Sub-Topic']),
            'learning_objective': str(row['Learning Objective'])
        }
    
    def create_student_attempt_data(self, student_id, question_data):
        # Convert student_id to standard Python int
        student_id = int(student_id) if isinstance(student_id, np.integer) else student_id
        student_metrics = self.student_df[self.student_df['studentID'] == student_id].iloc[0]
        attempt_records = []
        
        num_questions = int(np.random.randint(30, 50))
        selected_questions = np.random.choice(
            len(self.math_df),
            size=min(num_questions, len(self.math_df)),
            replace=False
        ).tolist()  # Convert NumPy array to list
        
        for q_idx in selected_questions:
            step_records = []
            cumulative_time = 0.0
            
            for i, step in enumerate(question_data[q_idx]['solution']):
                base_time = float(np.random.normal(30, 10))
                progress_factor = max(0.5, 1 - (len(attempt_records) / num_questions))
                time_taken = float(base_time * progress_factor)
                cumulative_time += time_taken
                
                step_records.append({
                    'step_number': i + 1,
                    'step_template': step['step_template'],
                    'correct_answer': step['correct_answer'],
                    'student_answer': step['correct_answer'],
                    'time_taken': time_taken,
                    'cumulative_time': float(cumulative_time)
                })
            
            attempt_records.append({
                'student_id': student_id,
                'question': {
                    'id': question_data[q_idx]['question_id'],
                    'text': question_data[q_idx]['question_text'],
                    'topic': question_data[q_idx]['topic'],
                    'sub_topic': question_data[q_idx]['sub_topic'],
                    'learning_objective': question_data[q_idx]['learning_objective']
                },
                'attempt_number': len(attempt_records) + 1,
                'steps': step_records,
                'total_time': float(cumulative_time)
            })
        
        return attempt_records
    
    def create_progress_dataset(self):
        print("Generating student progress data...")
        
        # Structure all questions
        question_data = [self.structure_question_steps(row) 
                        for _, row in self.math_df.iterrows()]
        
        # Generate student attempts
        all_records = []
        student_ids = self.student_df['studentID'].unique()
        
        for student_id in student_ids:
            student_records = self.create_student_attempt_data(student_id, question_data)
            all_records.extend(student_records)
        
        # Process all records to ensure they're JSON serializable
        processed_records = self._process_record(all_records)
        
        print(f"Generated {len(processed_records)} attempts across {len(student_ids)} students")
        
        # Save as JSON with explicit encoding of special types
        with open('student_progress_data.json', 'w') as f:
            json.dump(processed_records, f, indent=2)
        
        print("Data saved to student_progress_data.json")
        return processed_records
    
    def load_progress_data(self, filepath):
        """Load the progress data from JSON file"""
        with open(filepath, 'r') as f:
            return json.load(f)