import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import QuestionsComponent from "./QuestionsComponent";
import AttemptSummary from "./AttemptSummary";
import Confetti from "react-confetti";
import Spinner from "../../assets/Spinner.gif";
import { useAuth } from "../../AuthContext";

const ViewSingleTask = () => {
  const { task_id } = useParams();
  const { auth } = useAuth();
  const [taskDetails, setTaskDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isAttemptStarted, setIsAttemptStarted] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [class_id, setClassId] = useState();
  const [attempt_id, setAttemptId] = useState();
  const [totalTime, setTotalTime] = useState();
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/task/${task_id}`);
        setTaskDetails(response.data);
        setClassId(response.data.class_id);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    if (task_id) {
      fetchTaskDetails();
    }
  }, [task_id]);

  const handleStartAttempt = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/task/${task_id}/questions`
      );
      setQuestions(response.data.questions);
      setIsAttemptStarted(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAttemptComplete = (submittedAnswers, attemptData) => {
    const totalSteps = submittedAnswers.reduce(
      (sum, question) => sum + question.steps.length,
      0
    );
    const totalCorrect = submittedAnswers.reduce(
      (sum, question) =>
        sum +
        question.steps.filter(
          (step) => step.correct_answer === step.student_answer
        ).length,
      0
    );
    const totalTimeTaken = submittedAnswers.reduce(
      (sum, question) => sum + question.total_time,
      0
    );
    const calculatedScore = (totalCorrect / totalSteps) * 100;

    setAnswers(submittedAnswers);
    setScore(calculatedScore);
    setAttemptId(attemptData.attempt_id);
    setIsAttemptStarted(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    setTotalTime(totalTimeTaken);
    setIsSummaryVisible(true);
  };

  const handleTryAgain = () => {
    setIsSummaryVisible(false);
    setIsAttemptStarted(false);
    handleStartAttempt(); // Fetch new questions
  };

  if (!taskDetails) {
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
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar
        classDetails={taskDetails}
        activeTab="tasks"
        setActiveTab={() => { }}
        class_id={class_id}
      />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-6">
          {/* Task Header */}
          <div className="bg-white shadow rounded p-6 mb-4">
            {taskDetails ? (
              <>
                <h1 className="text-xl font-bold">{taskDetails.title}</h1>
                <p className="text-gray-600">{`${taskDetails.topic}/${taskDetails.sub_topic}`}</p>
              </>
            ) : (
              <p>Loading task details...</p>
            )}
          </div>

          {/* Confetti Animation */}
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

          {/* Content */}
          {!isAttemptStarted && !isSummaryVisible && (
            <div className="flex items-center justify-center">
              <button
                onClick={handleStartAttempt}
                className="primary-btn text-white px-6 py-2"
              >
                Start Attempt
              </button>
            </div>
          )}

          {isAttemptStarted && (
            <QuestionsComponent
              questions={questions}
              taskId={task_id}
              studentId={auth.user_id}
              onAttemptComplete={handleAttemptComplete}
            />
          )}

          {isSummaryVisible && (
            <AttemptSummary
              score={score}
              answers={answers}
              onReviewQuestions={() => console.log("Reviewing Questions")}
              onTryAgain={handleTryAgain}
              attemptId={attempt_id}
              totalTimetaken={totalTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSingleTask;
