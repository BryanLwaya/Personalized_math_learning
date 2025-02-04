import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

const EditTask = ({ task, onClose, onUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateTask = async () => {
        if (!title || !description) {
            toast.error("Please fill in all fields!");
            return;
        }

        setIsLoading(true);
        try {
            const payload = { title, description };
            const response = await axios.put(`http://localhost:5000/task/${task._id}`, payload);
            toast.success("Task updated successfully!");
            onUpdate(task._id, { title, description });
            onClose();
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                    <button onClick={onClose} className="px-4 py-2 text-primary">
                        <IoClose className="text-4xl" />
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
                        onClick={handleUpdateTask}
                        className="primary-btn px-4 py-2 text-white rounded-md transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTask;