import pandas as pd
import numpy as np
import json
import os
from data_transformer import TimeSeriesProgressTransformer

def load_datasets():
    """Load math and student datasets."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    math_dataset_file = os.path.join(current_dir, 'math_dataset_final.csv')
    student_data_file = os.path.join(current_dir, 'student_data_processed.csv')

    try:
        math_dataset = pd.read_csv(math_dataset_file, encoding="utf-8").dropna()
        student_data = pd.read_csv(student_data_file, encoding="utf-8").dropna()
        return math_dataset, student_data
    except UnicodeDecodeError:
        try:
            math_dataset = pd.read_csv(math_dataset_file, encoding="latin-1").dropna()
            student_data = pd.read_csv(student_data_file, encoding="latin-1").dropna()
            return math_dataset, student_data
        except Exception as e:
            print(f"Failed to load datasets: {e}")
            return None, None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None, None

def save_progress_data(progress_data):
    """Save and display progress data statistics."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_filename = os.path.join(current_dir, "student_progress_data.json")

    # Save the data
    with open(output_filename, 'w') as f:
        json.dump(progress_data, f, indent=2)
    print(f"Progress data saved to: {output_filename}")

    # Display statistics
    print("\nDataset Statistics:")
    student_ids = set(record['student_id'] for record in progress_data)
    question_ids = set(record['question']['id'] for record in progress_data)
    print(f"Number of students: {len(student_ids)}")
    print(f"Number of questions: {len(question_ids)}")
    
    # Display sample record
    print("\nSample Record Structure:")
    sample = progress_data[0]
    print("\nBasic Information:")
    print(f"Student ID: {sample['student_id']}")
    print(f"Question: {sample['question']['text'][:100]}...")
    print(f"Topic: {sample['question']['topic']}")
    print(f"Sub-topic: {sample['question']['sub_topic']}")
    
    print("\nStep Data:")
    for step in sample['steps'][:2]:  # Show first 2 steps
        print(f"\nStep {step['step_number']}:")
        print(f"Template: {step['step_template']}")
        print(f"Time Taken: {step['time_taken']:.2f} seconds")

if __name__ == "__main__":
    math_dataset, student_data = load_datasets()
    if math_dataset is not None and student_data is not None:
        transformer = TimeSeriesProgressTransformer(math_dataset, student_data)
        progress_data = transformer.create_progress_dataset()
        save_progress_data(progress_data)