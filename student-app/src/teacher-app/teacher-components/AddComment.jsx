import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

const AddComment = ({ studentId, class_id, onClose }) => {
    const [caption, setCaption] = useState("");
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddComment = async () => {
        if (!caption || !comment) {
            toast.error("Please fill in all fields!");
            return;
        }

        setIsLoading(true);
        try {
            const payload = { student_id: studentId, class_id, caption, comment };
            const response = await axios.post("http://localhost:5000/comments/add", payload);
            toast.success("Comment added successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Add Comment</h2>
                    <button onClick={onClose} className="text-primary">
                        <IoClose className="text-4xl" />
                    </button>
                </div>

                {/* Caption Input */}
                <div className="mb-4">
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                        Caption
                    </label>
                    <input
                        id="caption"
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter caption"
                    />
                </div>

                {/* Comment Textarea */}
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Comment
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your comment"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleAddComment}
                        className="primary-btn px-4 py-2 text-white rounded-md transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Comment"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddComment;