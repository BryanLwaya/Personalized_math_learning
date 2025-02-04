import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import Spinner from "../../assets/Spinner.gif";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import StudentSidebar from "./StudentSidebar";

const StudentComments = () => {
    const { class_id } = useParams();
    const { auth } = useAuth();
    const [comments, setComments] = useState([]);
    const [expandedComment, setExpandedComment] = useState(null);
    const [classDetails, setClassDetails] = useState({});
    const [activeTab, setActiveTab] = useState("comments");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:5000/comments/${class_id}`);
                const studentComments = response.data.filter(
                    (comment) => comment.student_id === auth.user_id
                );
                setComments(studentComments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/class/${class_id}`);
                setClassDetails(response.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
            }
        };

        fetchClassDetails();
        fetchComments();
    }, [class_id, auth.user_id]);

    const toggleExpanded = (commentId) => {
        setExpandedComment((prev) => (prev === commentId ? null : commentId));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src={Spinner} alt="Loading" />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 h-screen">
        <StudentSidebar
                classDetails={classDetails}
                activeTab={activeTab}
                setActiveTab={() => { setActiveTab }}
                class_id={class_id}
                classname={'fixed top-0 left-0'}
            />
            <div className="p-6 space-y-6 ml-[260px]">
                <h1 className="text-2xl font-bold text-gray-800">Comments</h1>
                <div className="space-y-4">
                    {comments.map((comment) => {
                        const isActive = expandedComment === comment._id;

                        return (
                            <div key={comment._id} className="bg-white shadow rounded-md p-4">
                                {/* Caption Row */}
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleExpanded(comment._id)}
                                >
                                    <h2 className="text-lg font-bold text-primary">
                                        {comment.caption || "No caption"}
                                    </h2>
                                    {isActive ? (
                                        <FiMinus className="text-2xl text-white bg-primary rounded-full p-1" />
                                    ) : (
                                        <FiPlus className="text-2xl text-white bg-primary rounded-full p-1" />
                                    )}
                                </div>

                                {/* Expandable Comment */}
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: isActive ? "auto" : 0,
                                        opacity: isActive ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={`overflow-hidden ${!isActive && "hidden"}`}
                                >
                                    <p className="mt-4 text-gray-800">{comment.comment}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <small>Posted At: {new Date(comment.created_at).toLocaleString()}</small>
                                    </p>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentComments;