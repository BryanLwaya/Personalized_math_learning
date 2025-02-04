import React, { useState, useEffect } from "react";
import axios from "axios";
import successImage from "../../assets/cool.png";
import closeImage from "../../assets/nice.png";
import averageImage from "../../assets/wow.png";

const AttemptSummary = ({
    score,
    attemptId,
    onReviewQuestions,
    totalTimetaken,
    onTryAgain,
}) => {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [answers, setAnswers] = useState(null); // Initialize as null to differentiate between loading and empty

    useEffect(() => {
        const fetchAttemptData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/attempt/${attemptId}`);
                setAnswers(response.data.questions || []); // Default to an empty array if no questions
            } catch (error) {
                console.error("Error fetching attempt data:", error);
            }
        };

        if (attemptId) {
            fetchAttemptData();
        }
    }, [attemptId]);

    const getSummaryImage = () => {
        if (score > 70) return { src: successImage, caption: "Amazing! You're a Genius" };
        if (score >= 50) return { src: averageImage, caption: "Wooow! So Close." };
        return { src: closeImage, caption: "You Really Tried! Maybe Next Time" };
    };

    const { src, caption } = getSummaryImage();

    return (
        <div className="flex flex-col items-center p-2 pb-0 bg-gray-100">
            {/* Score Display */}
            <h1 className="text-3xl font-bold mb-3">
                Your Score: {score.toFixed()}%
            </h1>
            <h2 className="text-md text-gray-700 mb-3">
                Total Time Taken: {totalTimetaken.toFixed(1)} seconds
            </h2>

            {/* Image and Caption */}
            <img src={src} alt="Summary" className="w-1/4" />
            <h1 className="text-xl font-bold text-gray-800">{caption}</h1>

            {/* Action Buttons */}
            <div className="flex space-x-6 mt-3">
                <button
                    onClick={() => setIsReviewOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
                >
                    Review Questions
                </button>
                <button
                    onClick={onTryAgain}
                    className="bg-yellow-500 text-white px-6 py-2 rounded shadow hover:bg-yellow-600"
                >
                    Try Again
                </button>
            </div>

            {/* Review Popup */}
            {isReviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] md:w-[50%] h-[80vh] overflow-y-auto relative">
                        <h2 className="text-2xl font-bold mb-4">Review Questions</h2>
                        <button
                            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                            onClick={() => setIsReviewOpen(false)}
                        >
                            ✖
                        </button>
                        <div className="space-y-4">
                            {answers ? (
                                answers.map((answer, index) => (
                                    <div key={index} className="p-4 border rounded">
                                        <p className="font-bold">
                                            Question {index + 1}: {answer.question_text}
                                        </p>
                                        <div className="space-y-2 mt-4">
                                            {answer.steps.map((step, stepIndex) => (
                                                <div key={stepIndex} className="p-2 border rounded">
                                                    <p className="font-medium">
                                                        Step {step.step_number}: {step.step_template}
                                                    </p>
                                                    <p>Your Answer: {step.student_answer || "Not Answered"}
                                                        {" "}<span
                                                            className={`text-lg font-bold ${step.student_answer === step.correct_answer
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                                }`}
                                                        >
                                                            {step.student_answer === step.correct_answer ? "✔" : "✖"}
                                                        </span></p>
                                                    <p>Correct Answer: {step.correct_answer}</p>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading review data...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttemptSummary;
