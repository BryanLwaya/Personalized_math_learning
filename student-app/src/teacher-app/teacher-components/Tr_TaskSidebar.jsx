import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { BiLogOut } from "react-icons/bi";
import { FiLink } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tr_TaskSidebar = ({ activeTab, setActiveTab, classDetails }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [isCodePopupVisible, setCodePopupVisible] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(classDetails.classcode);
        toast.success("Class code copied to clipboard!");
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Sidebar */}
            <div className="h-screen w-64 bg-white p-4 flex flex-col justify-between drop-shadow-lg z-20 fixed left-0 top-0">
                {/* Class Name */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">{classDetails.class_name || 'My Students'}</h2>
                        {/* Link Icon */}
                        <button
                            onClick={() => setCodePopupVisible(true)}
                            className="text-primary hover:text-blue-600 transition"
                            title="Show Class Code"
                        >
                            <FiLink size={20} />
                        </button>
                    </div>
                    <hr className="mb-3" />
                    <ul className="space-y-2">
                        <li
                            className={`cursor-pointer p-2 rounded ${activeTab === "tasks" ? "bg-primary text-white" : "hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setActiveTab("tasks")
                                navigate(`/teacher-class/${classDetails._id}`)
                            }}
                        >
                            Tasks
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded ${activeTab === "students" ? "bg-primary text-white" : "hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setActiveTab("students")
                                navigate(`/teacher/enrolled/${classDetails._id}`)
                            }}
                        >
                            Students
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded ${activeTab === "comments" ? "bg-primary text-white" : "hover:bg-gray-200"
                                }`}
                            onClick={() => {
                                setActiveTab("comments")
                                navigate(`/teacher/comments/${classDetails._id}`)
                            }}
                        >
                            Comments
                        </li>
                    </ul>
                </div>

                {/* Back Button */}
                <button
                    className="bg-gray-200 text-black px-4 py-2 mt-6 rounded hover:bg-gray-300 transition flex justify-center items-center gap-3"
                    onClick={() => navigate("/teacher-dashboard")}
                >
                    <BiLogOut />
                    Back to Dashboard
                </button>
            </div>

            {/* Class Code Popup */}
            {isCodePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {classDetails.class_name} - Class Code
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                            <span className="font-bold text-3xl block mt-1">{classDetails.classcode}</span>
                        </p>
                        <div className="flex gap-4 w-full mb-4 items-center justify-center p-0">
                            <button
                                onClick={handleCopyCode}
                                className="primary-btn text-white px-4 py-2 rounded-md transition"
                            >
                                Copy Code
                            </button>
                            <button
                                onClick={() => setCodePopupVisible(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tr_TaskSidebar;
