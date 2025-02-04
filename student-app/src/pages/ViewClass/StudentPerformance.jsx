import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../../assets/Spinner.gif";
import StudentSidebar from "./StudentSidebar";
import { useAuth } from "../../AuthContext";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const StudentPerformance = () => {
    const { auth } = useAuth();
    const { class_id: class_id } = useParams();
    const [performanceData, setPerformanceData] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState([]);
    const [classDetails, setClassDetails] = useState([]);
    const [activeTab, setActiveTab] = useState("performance");
    const [activeTopic, setActiveTopic] = useState("");
    const [userName, setUserName] = useState("");
    const [userInitials, setUserInitials] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPerformanceData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `http://localhost:5000/performance/analysis/${auth.user_id}`
            );
            const { performance, metrics } = response.data;

            // Filter metrics to retain only the latest data for each topic
            const filteredMetrics = Object.values(
                metrics.reduce((acc, metric) => {
                    const key = `${metric.topic}-${metric.sub_topic}`;
                    if (!acc[key] || new Date(metric.created_at) > new Date(acc[key].created_at)) {
                        acc[key] = metric;
                    }
                    return acc;
                }, {})
            );

            setPerformanceData(performance);
            setPerformanceMetrics(filteredMetrics);
            setErrorMessage("");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setPerformanceData(null);
                setErrorMessage("No performance analysis found. Try Out Some More Tasks first");
            } else {
                setErrorMessage("An error occurred while fetching performance data.");
            }
        }
    };

    const triggerPerformanceAnalysis = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `http://localhost:5000/student/performance/${auth.user_id}`
            );
            const { performance, metrics } = response.data;
            setPerformanceData(performance);
            setPerformanceMetrics(metrics || []);
            fetchPerformanceData();
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("An error occurred while generating performance analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    const getClassDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/class/${class_id}`);
            setClassDetails(response.data);

            const userResponse = await axios.get(`http://localhost:5000/users/${auth.user_id}`);
            const user_name = userResponse.data.name.split(" ")[0];
            setUserName(user_name);

            const initials = userResponse.data.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase();
            setUserInitials(initials);
        } catch (error) {
            console.error("Error fetching class details:", error);
        }
    };

    useEffect(() => {
        getClassDetails();
        triggerPerformanceAnalysis();
        // fetchPerformanceData();
    }, [class_id, auth.user_id]);

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

    if (!performanceData) {
        return (
            <div className="ml-[100px] p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center font-semibold">
                <StudentSidebar
                    classDetails={classDetails}
                    activeTab="performance"
                    setActiveTab={() => { setActiveTab }}
                    class_id={class_id}
                    classname={'fixed top-0 left-0'}
                />
                {errorMessage && <p className="text-red-500 mt-3 text-lg">{errorMessage}</p>}
            </div>
        );
    }

    const { analysis, prediction, created_at } = performanceData;

    return (
        <div className="bg-gray-100 h-screen">
            <StudentSidebar
                classDetails={classDetails}
                activeTab="performance"
                setActiveTab={() => { setActiveTab }}
                class_id={class_id}
                classname={'fixed top-0 left-0'}
            />
            <div className="bg-gray-100 min-h-screen ml-[250px]">
                {/* Header Section */}
                <div className="p-6 flex justify-between items-center pb-4 border-b-2 mb-3">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{userName}'s Performance</h1>
                        <p className="text-gray-600">
                            Last Analysis: {new Date(created_at).toLocaleString()}
                        </p>
                    </div>
                    <div
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-white font-bold"
                        title="Your Initials"
                    >
                        {userInitials}
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-7 py-6">
                    {/* Learning Trends Section */}
                    <div className="bg-white shadow p-6 rounded mb-6">
                        <h2 className="text-xl font-bold mb-4">Learning Trends</h2>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Average Correctness</h3>
                            <div className="w-full bg-gray-300 h-4 rounded">
                                <div
                                    className="bg-primary h-4 rounded"
                                    style={{
                                        width: `${Math.min(analysis.learning_trends.average_correctness * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm mt-2 text-gray-600">
                                {`${(analysis.learning_trends.average_correctness * 100).toFixed()}%`}
                            </p>
                        </div>

                        {/* <div className="mb-4">
                            <p className="text-lg font-semibold">Time Consistency
                            <strong>{analysis.learning_trends.consistency.toFixed(2)}</strong>
                            </p>
                        </div> */}

                        <p className="text-gray-700">
                            <strong>Average Time per Step:</strong>{" "}
                            {`${performanceMetrics.length > 0 ? performanceMetrics[0].metrics.average_time_per_step.toFixed(2) : "N/A"} seconds`}
                        </p>
                        <p
                            className={`font-bold ${analysis.learning_trends.time_efficiency === "Needs Attention"
                                ? "text-red-500"
                                : "text-green-500"
                                }`}
                        >
                            {analysis.learning_trends.time_efficiency === "Needs Attention" ? "Improve on your speed" : "Keep up the speed"}
                        </p>
                    </div>

                    {/* Topic-Wise Metrics */}
                    <div className="bg-white shadow p-6 rounded mb-6">
                        <h2 className="text-xl font-bold mb-4">Topic Performance</h2>
                        {performanceMetrics.map((metric, index) => {
                            const isActive =
                                activeTopic?.topic === metric.topic &&
                                activeTopic?.sub_topic === metric.sub_topic;

                            return (
                                <div key={index} className="mb-4">
                                    {/* Toggle Header */}
                                    <div
                                        className="text-lg font-semibold bg-gray-200 p-2 rounded cursor-pointer"
                                        onClick={() =>
                                            setActiveTopic(isActive ? null : metric)
                                        }
                                    >
                                        {`${metric.topic} - ${metric.sub_topic}`}
                                    </div>
                                    {/* Toggle Content */}
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: isActive ? "auto" : 0,
                                            opacity: isActive ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className={`overflow-hidden ${!isActive && "hidden"}`}
                                    >
                                        <div className="mt-4">
                                            {/* Average Score */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold mt-2">
                                                    Average Score
                                                </h3>
                                                <div className="w-full bg-gray-300 h-4 rounded">
                                                    <div
                                                        className="bg-primary h-4 rounded"
                                                        style={{
                                                            width: `${Math.min(
                                                                metric.metrics.average_score * 100,
                                                                100
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm mt-2 text-gray-600">
                                                    {`${(metric.metrics.average_score * 100).toFixed(
                                                        2
                                                    )}%`}
                                                </p>
                                            </div>
                                            {/* Improvement Rate */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <p className="font-bold">Improvement Rate:</p>
                                                <div
                                                    className={`font-bold inline-flex items-center gap-1 ${metric.metrics.improvement_rate > 0
                                                            ? "text-green-500"
                                                            : metric.metrics.improvement_rate < 0
                                                                ? "text-red-500"
                                                                : "text-black"
                                                        }`}
                                                >
                                                    <p>{`${(
                                                        metric.metrics.improvement_rate
                                                    ).toFixed(2)}%`}</p>
                                                    <div>
                                                        {metric.metrics.improvement_rate > 0 ? (
                                                            <FaArrowUp />
                                                        ) : metric.metrics.improvement_rate < 0 ? (
                                                            <FaArrowDown />
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Prediction Section */}
                    <div className="bg-white shadow p-6 rounded mb-6">
                        <h2 className="text-xl font-bold mb-1">Improvement Prediction</h2>
                        <p className={`text-lg font-bold ${prediction.will_improve
                            ? "text-green-500"
                            : "text-red-500"}`}>
                            {prediction.will_improve
                                ? "Great Improvement: Keep it up!"
                                : "Low Improvement: Keep Doing Your Best and You Will Improve"}
                        </p>
                        <p className="text-sm mt-2 text-gray-600">
                            Confidence Level: {(prediction.confidence * 100).toFixed(1)}%
                        </p>
                    </div>

                    {/* Recommendations Section */}
                    <div className="bg-white shadow p-6 rounded">
                        <h2 className="text-xl font-bold mb-4">Recommendations</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            {analysis.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformance;
