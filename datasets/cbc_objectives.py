import pandas as pd

# Data extracted from the PDF for Strands, subStrands, and learning objectives.
data = [
    {"Strand": "Numbers", "Sub-Strand": "Whole Numbers",
     "Learning Objective": "Use place value and total value of digits up to tens of thousands in daily life situations."},
    {"Strand": "Numbers", "Sub-Strand": "Addition",
     "Learning Objective": "Add up to two 4-digit numbers with single regrouping up to a sum of 10,000 in different situations."},
    {"Strand": "Numbers", "Sub-Strand": "Subtraction",
     "Learning Objective": "Subtract up to 4-digit numbers without regrouping in real life situations."},
    {"Strand": "Numbers", "Sub-Strand": "Multiplication",
     "Learning Objective": "Multiply up to a two-digit number by a two-digit number in different situations."},
    {"Strand": "Numbers", "Sub-Strand": "Division",
     "Learning Objective": "Divide up to a two-digit number by a one-digit number with and without remainder."},
    {"Strand": "Numbers", "Sub-Strand": "Fractions",
     "Learning Objective": "Identify the numerator and denominator in a fraction in different situations."},
    {"Strand": "Numbers", "Sub-Strand": "Decimals",
     "Learning Objective": "Identify a tenth and a hundredth in real life situations."},
    {"Strand": "Numbers", "Sub-Strand": "Use of Letters",
     "Learning Objective": "Form simple expressions using letters to represent real life situations and simplify expressions representing real life situations."},
    {"Strand": "Measurement", "Sub-Strand": "Length",
     "Learning Objective": "Identify the centimetre as a unit of measuring length in real life situations."},
    {"Strand": "Measurement", "Sub-Strand": "Area",
     "Learning Objective": "Compare the area of given surfaces by direct manipulation."},
    {"Strand": "Measurement", "Sub-Strand": "Volume",
     "Learning Objective": "Pile objects into stacks of cubes and cuboids in real life situations."},
    {"Strand": "Measurement", "Sub-Strand": "Capacity",
     "Learning Objective": "Measure capacity in litres in real life situations."},
    {"Strand": "Measurement", "Sub-Strand": "Mass",
     "Learning Objective": "Use a kilogram mass to measure masses of different objects practically."},
    {"Strand": "Measurement", "Sub-Strand": "Time",
     "Learning Objective": "Read and tell time in a.m. and p.m. in real life situations."},
    {"Strand": "Measurement", "Sub-Strand": "Money",
     "Learning Objective": "Convert shillings into cents and cents into shillings in different contexts."},
    {"Strand": "Geometry", "Sub-Strand": "Position and Direction",
     "Learning Objective": "Identify a clockwise and an anti-clockwise turn in the environment."},
    {"Strand": "Geometry", "Sub-Strand": "Angles",
     "Learning Objective": "Identify an angle at a point in lines."},
    {"Strand": "Geometry", "Sub-Strand": "Plane Figures",
     "Learning Objective": "Identify rectangles, squares, triangles, circles and ovals from objects in the environment."},
    {"Strand": "Data Handling", "Sub-Strand": "Data",
     "Learning Objective": "Identify materials for data collection and recording in real life situations."}
]

# Creating a DataFrame from the extracted data
df = pd.DataFrame(data)

# Save to CSV
output_file = "Grade_4_CBC_Objectives.csv"
df.to_csv(output_file, index=False)

