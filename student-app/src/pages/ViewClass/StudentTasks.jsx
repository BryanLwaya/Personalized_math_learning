import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { IoMdTrash, IoMdEye } from "react-icons/io";
import axios from "axios";
import Mathbg from "../../assets/math_bg2.jpg";

const StudentTasks = ({ class_id }) => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/tasks/${class_id}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        if (class_id) {
            fetchTasks();
        }
    }, [class_id]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        <div className="bg-gray-300">
                            <img
                                src={Mathbg}
                                alt={task.topic}
                                className="h-20 w-full object-cover"
                            />
                        </div>

                        {/* Task Content */}
                        <div className="p-4">
                            <h2 className="text-lg font-bold text-gray-800 truncate">{task.title}</h2>
                            <p className="text-sm text-gray-500 truncate">{task.created_at}</p>
                            <div className="flex w-full items-center justify-center">
                                <button
                                    className="primary-btn mt-3"
                                    onClick={() => navigate(`/view-task/${task._id}`)}
                                >
                                    Do Task
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentTasks;
