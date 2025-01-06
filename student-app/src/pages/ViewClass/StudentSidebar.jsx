import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentSidebar = ({ classDetails, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col justify-between drop-shadow-lg z-20">
      {/* Class Name */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">{classDetails.class_name}</h2>
        <hr className="mb-3" />
        <ul className="space-y-2">
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "tasks" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${
              activeTab === "comments" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </li>
        </ul>
      </div>

      {/* Back Button */}
      <button
        className="bg-gray-200 text-black px-4 py-2 mt-6 rounded hover:bg-gray-300 transition flex items-center gap-2"
        onClick={() => navigate("/classes")}
      >
        <FaArrowLeft />
        Back to Classes
      </button>
    </div>
  );
};

export default StudentSidebar;