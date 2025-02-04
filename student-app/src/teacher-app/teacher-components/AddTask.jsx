import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

const AddTask = ({ class_id, onClose }) => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [title, setTitle] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedSubtopic, setSelectedSubtopic] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch topics from the backend
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get("http://localhost:5000/topics");
                setTopics(response.data);
            } catch (error) {
                console.error("Error fetching topics:", error);
                toast.error("Failed to fetch topics.");
            }
        };
        fetchTopics();
    }, []);

    const handleAddTask = async () => {
        if (!title || !selectedTopic || !selectedSubtopic || !description) {
            toast.error("Please fill in all fields!");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                class_id: class_id,
                title,
                topic: selectedTopic,
                sub_topic: selectedSubtopic,
                description,
            };

            const response = await axios.post("http://localhost:5000/tasks/add-task", payload);
            toast.success("Task added successfully!");
            navigate(`/teacher-class/${class_id}`);
            onClose();
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar className="z-50" />
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Add Task</h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-primary"
                    >
                        <IoClose className="text-4xl"/>
                    </button>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Task Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter task title"
                    />
                </div>

                {/* Topic Dropdown */}
                <div className="mb-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                        Select Topic
                    </label>
                    <select
                        id="topic"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">-- Select a Topic --</option>
                        {topics.map((topic) => (
                            <option key={topic._id} value={topic.topic_name}>
                                {topic.topic_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subtopic Dropdown */}
                <div className="mb-4">
                    <label htmlFor="subtopic" className="block text-sm font-medium text-gray-700">
                        Select Subtopic
                    </label>
                    <select
                        id="subtopic"
                        value={selectedSubtopic}
                        onChange={(e) => setSelectedSubtopic(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!selectedTopic}
                    >
                        <option value="">-- Select a Subtopic --</option>
                        {selectedTopic &&
                            topics
                                .find((topic) => topic.topic_name === selectedTopic)
                                ?.subtopics.map((subtopic, index) => (
                                    <option key={index} value={subtopic.subtopic_name}>
                                        {subtopic.subtopic_name}
                                    </option>
                                ))}
                    </select>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">

                    <button
                        onClick={handleAddTask}
                        className="primary-btn px-4 py-2 text-white rounded-md transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTask;
