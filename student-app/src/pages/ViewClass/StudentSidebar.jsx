import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const StudentSidebar = ({ classDetails, activeTab, setActiveTab, class_id, classname }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <>
      <div className={`w-64 bg-white p-4 flex flex-col justify-between drop-shadow-lg z-20 h-screen ${classname || ''}`}>
        {/* Class Name */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{classDetails.class_name || classDetails.title}</h2>
          <hr className="mb-3" />
          <ul className="space-y-2">
            <li
              className={`cursor-pointer p-2 rounded ${activeTab === "tasks" ? "bg-primary text-white" : "hover:bg-gray-200"
                }`}
              onClick={() => {
                setActiveTab("tasks")
                navigate(`/view-class/${class_id}`)
              }}
            >
              Tasks
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${activeTab === "performance" ? "bg-primary text-white" : "hover:bg-gray-200"
                }`}
              onClick={() => {
                setActiveTab("performance")
                navigate(`/student/performance/${class_id}`)
              }}
            >
              Performance
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${activeTab === "comments" ? "bg-primary  text-white" : "hover:bg-gray-200"
                }`}
              onClick={() => {
                setActiveTab("comments")
                navigate(`/student/comments/${class_id}`)
              }}
            >
              Comments
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <button
          className="bg-gray-200 text-black px-4 py-2 mt-6 rounded hover:bg-gray-300 transition flex items-center gap-2"
          onClick={() =>
            navigate("/classes")
          }
        >
          <FaArrowLeft />
          Back to Class
        </button>
      </div>
    </>
  );
};

export default StudentSidebar;
