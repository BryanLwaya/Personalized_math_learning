import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook, FaArrowLeft, FaLock, FaPlayCircle } from "react-icons/fa";

const lessons = [
    { id: 1, title: "Introduction", icon: <FaPlayCircle /> },
    { id: 2, title: "Deep Dive", icon: <FaLock /> },
    { id: 3, title: "Exploring the Basics", icon: <FaLock /> },
    { id: 4, title: "Outro", icon: <FaLock /> },
];

const ViewClass = ({ classes }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const selectedClass = classes.find((classItem) => classItem.id === parseInt(id));
    const [activeLesson, setActiveLesson] = useState(lessons[0].id); // Set the first lesson as active by default

    if (!selectedClass) {
        return <div>Class not found</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#f1f1f1] text-black flex flex-col justify-between drop-shadow-lg">
                <div className="p-4">
                    <button className="primary-btn w-full text-white py-2 rounded mb-6 transition">
                        Start New Lesson
                    </button>
                    <ul className="space-y-0">
                        {lessons.map((lesson) => (
                            <li
                                key={lesson.id}
                                className={`flex items-center p-3 cursor-pointer transition relative ${activeLesson === lesson.id
                                        ? "bg-primary bg-opacity-20 text-black"
                                        : "hover:bg-gray-200"
                                    }`}
                                onClick={() => setActiveLesson(lesson.id)}
                            >
                                <span className="mr-3">{lesson.icon}</span>
                                <span className="flex-grow">{lesson.title}</span>
                                {activeLesson === lesson.id && (
                                    <div className="absolute top-0 right-0 h-full w-1 bg-primary" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-4">
                    <button
                        className="flex items-center w-full text-gray-700 hover:bg-gray-300 hover:text-black p-3 rounded transition"
                        onClick={() => navigate("/classes")}
                    >
                        <FaArrowLeft className="mr-3" />
                        Back to Classes
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{selectedClass.title}</h1>
                        <p className="text-gray-600">{selectedClass.subTopic}</p>
                    </div>
                    <img
                        src="https://via.placeholder.com/50"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                </div>

                {/* Main Body */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">Class Details</h2>
                    <p>
                        <strong>Teacher:</strong> {selectedClass.teacher}
                    </p>
                    <p className="mt-4">
                        Welcome to the {selectedClass.title} class. Select a lesson from the sidebar to get started!
                    </p>
                    <p className="mt-4">
                        <strong>Active Lesson:</strong> {lessons.find((lesson) => lesson.id === activeLesson)?.title}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewClass;
