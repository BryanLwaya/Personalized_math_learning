import React, { useState } from "react";
import axios from "axios";
import Spinner from "../../assets/Spinner.gif";


const QuestionsComponent = ({ questions, taskId, studentId, onAttemptComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [stepStartTime, setStepStartTime] = useState(Date.now()); // Track start time of the current step
  const [isLoading, setIsLoading] = useState(false); // Track loading state for submission

  const currentQuestion = questions[currentQuestionIndex];
  const currentStep = currentQuestion.steps[currentStepIndex];

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleNextStep = () => {
    const stepEndTime = Date.now(); // Record end time of the current step
    const timeTaken = (stepEndTime - stepStartTime) / 1000; // Calculate time taken in seconds

    const answerStep = {
      step_number: currentStep.step_number,
      step_template: currentStep.step_template, // Include step text for review
      correct_answer: currentStep.correct_answer,
      student_answer: inputValue,
      time_taken: timeTaken,
    };

    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];

      if (!updatedAnswers[currentQuestionIndex]) {
        updatedAnswers[currentQuestionIndex] = {
          question_id: currentQuestion._id,
          question_text: currentQuestion.question,
          steps: [],
        };
      }

      updatedAnswers[currentQuestionIndex].steps.push(answerStep);

      return updatedAnswers;
    });

    if (currentStepIndex + 1 < currentQuestion.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepStartTime(Date.now());
    } else {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestionIndex].total_time = updatedAnswers[currentQuestionIndex].steps.reduce(
          (sum, step) => sum + step.time_taken,
          0
        );
        updatedAnswers[currentQuestionIndex].correct_count = updatedAnswers[currentQuestionIndex].steps.filter(
          (step) => step.correct_answer === step.student_answer
        ).length;

        return updatedAnswers;
      });

      setCurrentStepIndex(0);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setStepStartTime(Date.now());
      } else {
        console.log("Final Answers", answers);
        handleSubmit(answers);
      }
    }

    setInputValue("");
    setProgress(
      ((currentQuestionIndex * currentQuestion.steps.length + currentStepIndex + 1) /
        (questions.length * currentQuestion.steps.length)) *
      100
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue) {
      handleNextStep();
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setIsLoading(true); // Show loading screen
    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    while (attempts < maxRetries && !success) {
      try {
        const payload = {
          student_id: studentId,
          task_id: taskId,
          answers: finalAnswers,
        };

        const response = await axios.post("http://localhost:5000/submit_attempt", payload);

        const attemptData = response.data;
        onAttemptComplete(finalAnswers, attemptData);
        success = true;
        setIsLoading(false); // Hide loading screen
      } catch (error) {
        attempts++;
        console.error(`Error submitting task (attempt ${attempts}):`, error);

        if (attempts >= maxRetries) {
          setIsLoading(false); // Hide loading screen after max retries
          alert("Failed to submit task after multiple attempts. Please try again.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {
          <img src={Spinner} alt="" /> ||
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500">
            <span className="sr-only">Loading</span>
          </div>
        }
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4 bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="text-black font-bold mb-6">{currentQuestion.question}</p>

        <div className="bg-gray-100 p-4 rounded">
          <p className="font-normal text-gray-700">{currentStep.step_template}</p>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Listen for Enter key
            className="mt-4 w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your answer"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleNextStep}
            disabled={!inputValue}
            className={`${inputValue ? "primary-btn" : "bg-gray-300"
              } text-white px-4 py-2 rounded shadow`}
          >
            {currentStepIndex + 1 === currentQuestion.steps.length &&
              currentQuestionIndex + 1 === questions.length
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-300 h-2 rounded">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsComponent;
