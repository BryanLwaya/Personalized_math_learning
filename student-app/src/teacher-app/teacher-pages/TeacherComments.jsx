import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import Spinner from "../../assets/Spinner.gif";
import Tr_TaskSidebar from "../teacher-components/Tr_TaskSidebar";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const TeacherComments = () => {
    const { class_id } = useParams();
    const { auth } = useAuth();
    const [comments, setComments] = useState([]);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [classDetails, setClassDetails] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const [initials, setInitials] = useState("");
    const [activeTab, setActiveTab] = useState("comments");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/comments/${class_id}`);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const getClassDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/class/${class_id}`);
                setClassDetails(response.data);
            } catch (error) {
                console.error("Error occured: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTeacherDetails = async () => {
            if (auth.user_id) {
                try {
                    const response = await axios.get(`http://localhost:5000/users/${auth.user_id}`);
                    const { name } = response.data;
                    setTeacherName(`Tr. ${name}`);
                    const nameParts = name.split(" ");
                    const userInitials =
                        nameParts.length > 1
                            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
                            : name[0].toUpperCase();
                    setInitials(userInitials);
                } catch (error) {
                    console.error("Error fetching teacher details:", error);
                }
            }
        };

        if (class_id) {
            getClassDetails();
            fetchTeacherDetails();
            fetchComments();
        }
    }, [class_id]);

    const toggleExpanded = (studentId) => {
        setExpandedStudent((prev) => (prev === studentId ? null : studentId));
    };

    if (!classDetails) { setIsLoading(true); }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src={Spinner} alt="Loading" />
            </div>
        );
    }

    // Group comments by student
    const groupedComments = comments.reduce((acc, comment) => {
        if (!acc[comment.student_id]) {
            acc[comment.student_id] = { student_name: comment.student_name, comments: [] };
        }
        acc[comment.student_id].comments.push(comment);
        return acc;
    }, {});

    return (
        <div className="h-screen bg-gray-100">
            {/* Sidebar */}
            <Tr_TaskSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                classDetails={classDetails}
            />
            <div className="ml-[250px]">
                <div className="flex justify-between items-center px-6 py-5 border-b-2 ">
                    <h1 className="text-xl font-bold">Comments</h1>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-800 text-lg font-semibold">{teacherName}</span>
                        <div
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white font-bold"
                            title={teacherName}
                        >
                            {initials}
                        </div>
                    </div>
                </div>
                <div className="space-y-4 p-6">
                    {Object.keys(groupedComments).map((studentId) => {
                        const { student_name, comments } = groupedComments[studentId];
                        const isActive = expandedStudent === studentId;

                        return (
                            <div key={studentId} className="bg-white shadow rounded-md p-4">
                                {/* Student Name Row */}
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleExpanded(studentId)}
                                >
                                    <h2 className="text-lg font-bold text-gray-800">{student_name}</h2>
                                    {isActive ? (
                                        <FiMinus className="text-2xl text-white bg-primary rounded-full p-1" />
                                    ) : (
                                        <FiPlus className="text-2xl text-white bg-primary rounded-full p-1" />
                                    )}
                                </div>

                                {/* Expandable Comments */}
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: isActive ? "auto" : 0,
                                        opacity: isActive ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={`overflow-hidden ${!isActive && "hidden"}`}
                                >
                                    <ul className="mt-4 space-y-2">
                                        {comments.map((comment) => (
                                            <li key={comment._id} className="text-gray-600">
                                                <p className="font-bold">
                                                    Caption: <span className="text-primary">{comment.caption || "No caption"}</span>
                                                </p>
                                                <p>
                                                    {comment.comment}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    <small>Posted At:{" "}
                                                    {new Date(comment.created_at).toLocaleString()}</small>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
};

export default TeacherComments;
