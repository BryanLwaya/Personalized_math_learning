import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../../assets/Spinner.gif";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Tr_TaskSidebar from "../teacher-components/Tr_TaskSidebar";
import AddComment from "../teacher-components/AddComment";
import DisplayGraph from "./DisplayGraph";

const TrPerformanceView = () => {
  const { student_id: studentId, class_id } = useParams();
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [classDetails, setClassDetails] = useState([]);
  const [userName, setUserName] = useState("");
  const [isAddCommentVisible, setAddCommentVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGraphVisible, setGraphVisible] = useState(false);

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/performance/analysis/${studentId}`
      );
      const { performance, metrics } = response.data;

      const filteredMetrics = Object.values(
        metrics.reduce((acc, metric) => {
          const key = `${metric.topic}-${metric.sub_topic}`;
          if (!acc[key] || new Date(metric.created_at) > new Date(acc[key].created_at)) {
            acc[key] = metric;
          }
          return acc;
        }, {})
      );

      // Prepare data for the graph
      const topicData = metrics.reduce((acc, metric) => {
        const key = `${metric.topic}-${metric.sub_topic}`;
        if (!acc[key]) {
          acc[key] = { label: key, data: [], borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
        }
        acc[key].data.push({
          x: new Date(metric.time_period.end),
          y: metric.metrics.average_score * 100, // Convert score to percentage
        });
        return acc;
      }, {});

      const datasets = Object.values(topicData).map((topic) => ({
        label: topic.label,
        data: topic.data.sort((a, b) => a.x - b.x), // Sort by time
        borderColor: topic.borderColor,
        backgroundColor: `${topic.borderColor}33`, // Add transparency
        tension: 0.2,
      }));

      setGraphData(datasets);

      setPerformanceData(performance);
      setPerformanceMetrics(filteredMetrics || []);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setPerformanceData(null);
        setErrorMessage("No performance analysis found. Student needs to do more tasks");
      } else {
        setErrorMessage("An error occurred while fetching performance data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getClassandStudentDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/class/${class_id}`);
      setClassDetails(response.data);

      const userResponse = await axios.get(`http://localhost:5000/users/${studentId}`);
      const user_name = userResponse.data.name;
      setUserName(user_name);

    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getClassandStudentDetails();
    fetchPerformanceData();
    setIsLoading(false);
  }, [studentId, class_id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={Spinner} alt="" />
      </div>
    );
  }

  if (!classDetails) {
    setIsLoading(true);
  }

  if (!performanceData) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center ml-[150px]">
        <Tr_TaskSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          classDetails={classDetails}
        />
        {errorMessage && <p className="text-red-500 mt-3 text-lg font-semibold">{errorMessage}</p>}
      </div>
    );
  }

  const { analysis, prediction, created_at } = performanceData;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Tr_TaskSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        classDetails={classDetails}
      />
      <div className="ml-[260px]">
        {/* Header Section */}
        <div className="p-6 flex justify-between items-center pb-4 border-b-2 mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">{userName}'s Performance</h1>
            <p className="text-gray-600">
              Last Analysis: {new Date(created_at).toLocaleString()}
            </p>
          </div>

          <button className="primary-btn mt-3 justify-end"
            onClick={() => setAddCommentVisible(true)}
          >
            Make Comment
          </button>
        </div>


        {/* Main Content */}
        <div className="p-6">
          {/* Learning Trends Section */}
          <div className="bg-white shadow p-6 rounded mb-6">
            <h2 className="text-xl font-bold mb-4">Learning Trends</h2>

            {/* Average Correctness */}
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

            {/* Consistency */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Consistency in Time Taken</h3>
              <div className="w-full bg-gray-300 h-4 rounded">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${Math.min(analysis.learning_trends.consistency, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-gray-600">
                Value: {analysis.learning_trends.consistency.toFixed(2)}%
              </p>
            </div>

            {/* Time Analytics */}
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
              {analysis.learning_trends.time_efficiency}
            </p>
          </div>

          {/* Topic-Wise Metrics */}
          <div className="bg-white shadow p-6 rounded mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Topic Performance</h2>
              <button
                className="primary-btn text-white px-4 py-2 rounded"
                onClick={() => setGraphVisible(true)}
              >
                View Stats
              </button>
            </div>

            {performanceMetrics.map((metric, index) => (
              <div key={index} className="mb-4">
                <div
                  className="text-lg font-semibold bg-gray-100 p-3 rounded cursor-pointer"
                  onClick={() =>
                    setActiveTopic(
                      activeTopic?.topic === metric.topic && activeTopic?.sub_topic === metric.sub_topic
                        ? null
                        : metric
                    )
                  }
                >
                  {`${metric.topic} - ${metric.sub_topic}`}
                </div>
                {activeTopic?.topic === metric.topic && activeTopic?.sub_topic === metric.sub_topic && (
                  <div className="mt-4">
                    {/* Average Score */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mt-2">Average Score</h3>{" "}
                      <div className="w-full bg-gray-300 h-4 rounded">
                        <div
                          className="bg-primary h-4 rounded"
                          style={{ width: `${Math.min(metric.metrics.average_score * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-2 text-gray-600">
                        {`${(metric.metrics.average_score * 100).toFixed(2)}%`}
                      </p>
                    </div>
                    {/* Accuracy Rate */}
                    <p>
                      <strong>Accuracy Rate:</strong>{" "}
                      {`${(metric.metrics.accuracy_rate * 100).toFixed(1)}%`}
                    </p>
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
                        <p>{`${(metric.metrics.improvement_rate).toFixed(2)}%`}</p>
                        <div>
                          {metric.metrics.improvement_rate > 0 ? (
                            <FaArrowUp />
                          ) : metric.metrics.improvement_rate < 0 ? (
                            <FaArrowDown />
                          ) : ''}
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prediction Section */}
          <div className="bg-white shadow p-6 rounded mb-6">
            <h2 className="text-xl font-bold mb-1">Improvement Prediction</h2>
            <p
              className={`text-lg font-bold ${prediction.will_improve ?
                "text-green-500" :
                "text-red-500"
                }`}
            >
              {prediction.will_improve
                ? "Student is on the path of improvement"
                : "Slow Progress, Attention Needed!"}
            </p>
            <p className="text-sm mt-2 text-gray-600">
              Confidence Level: {(prediction.confidence * 100).toFixed(1)}%
            </p>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white shadow p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Recommendations to Student</h2>
            <ul className="list-disc list-inside text-gray-700">
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {isAddCommentVisible && (
        <AddComment
          studentId={studentId}
          class_id={class_id}
          onClose={() => setAddCommentVisible(false)}
        />
      )}

      {/* Display Graph Popup */}
      {isGraphVisible && (
        <DisplayGraph
          title="Topic Performances Over Time"
          datasets={graphData}
          onClose={() => setGraphVisible(false)}
        />
      )}

    </div>
  );
};

export default TrPerformanceView;
