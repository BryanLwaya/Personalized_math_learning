# Personalized Mathematics AI Learning Tracker

## Overview

The **Personalized Mathematics AI Learning Tracker** is a web-based platform designed to help students enhance their mathematical skills through adaptive learning techniques. The system provides a structured environment where students can join classes, complete assignments, and track their progress. Teachers can create and manage classes, assign tasks, and monitor student performance. The model can predict the learning trajectory of the student to detect improvement or poor performance early enough for it to be addressed.

## Features

- **Student Authentication**: Secure sign-up and login functionality.
- **Class Management**: Students can join and view classes, while teachers can create and manage them.
- **Task Assignments**: Students receive tasks, complete them, and track their performance.
- **Performance Tracking**: Both students and teachers can analyze progress over time.
- **Learning Curve Prediction**: The ML model uses the student performance data to predict future performances to detect any potential improvement or poor performance.

---

## File Structure

```
📁Personalized_math_learning
    ├── 📁backend
    │   ├── 📁app
    │   │   ├── __init__.py
    │   │   ├── 📁auth
    │   ├── config.py
    │   ├── requirements.txt
    │   ├── run.py
    ├── 📁datasets
    │   ├── 📁GPT finetuning
    ├── 📁student-app
    │   ├── 📁public
    │   │   ├── vite.svg
    │   ├── README.md
    │   ├── 📁src
    │   │   ├── App.jsx
    │   │   ├── 📁assets
    │   │   ├── 📁components
    │   │   ├── 📁pages
    │   │   ├── 📁teacher-app
    │   │   │   ├── 📁teacher-components
    │   │   │   ├── 📁teacher-pages
    ├── .gitignore
    ├── readme.md
    ├── requirements.txt
```

---

## Setup and Installation

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo/personalized-math-learning.git
cd personalized-math-learning
```

### 2. Backend Setup (Flask)

```sh
cd backend
python -m venv venv  # Create a virtual environment
```

#### Activate Virtual Environment

##### Mac/Linux

```sh
source venv/bin/activate
```

##### Windows

```sh
venv\Scripts\activate
```

#### Install Dependencies

```sh
pip install -r requirements.txt 
```

#### Run the Backend Server

```sh
python run.py
```

### 3. Frontend Setup (React + Vite)

#### Install Dependencies

```sh
cd student-app
npm install
```

#### Run the Frontend

```sh
npm run dev
```

---

## Usage Guide

1. **Open the Web App**: Access the frontend via `http://localhost:5173/` (default Vite port).
2. **Sign Up / Login**: Create an account as a student or teacher.
3. **Join or Create Classes**: Students can join existing classes, while teachers can create and manage them.
4. **Track Performance**: View learning progress through analytics and reports.

---

## Contributing

Contributions are welcome! If you'd like to improve this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a Pull Request.