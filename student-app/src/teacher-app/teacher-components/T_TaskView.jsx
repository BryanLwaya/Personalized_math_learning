import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { IoMdTrash, IoMdEye } from "react-icons/io";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTask from "./AddTask";
import Spinner from "../../assets/Spinner.gif";
import Mathbg from "../../assets/math_bg.jpg";
import DeleteItem from "./DeleteItem";
import EditTask from "./EditTask";

const T_TasksView = ({ class_id }) => {
    const [tasks, setTasks] = useState([]);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
    const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isEditPopupVisible, setEditPopupVisible] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/tasks/${class_id}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (class_id) {
            fetchTasks();
        }
    }, [class_id]);

    const showDeletePopup = (task) => {
        setTaskToDelete(task);
        setIsDeletePopupVisible(true);
    };

    const hideDeletePopup = () => {
        setIsDeletePopupVisible(false);
        setTaskToDelete(null);
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/task/${taskToDelete._id}`);
            toast.success(response.data.message);
            // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete._id));
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task. Please try again.");
        } finally {
            hideDeletePopup();
        }
    };

    const showEditPopup = (task) => {
        setTaskToEdit(task);
        setEditPopupVisible(true);
    };

    const hideEditPopup = () => {
        setEditPopupVisible(false);
        setTaskToEdit(null);
    };

    const handleTaskUpdate = (taskId, updatedData) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, ...updatedData } : task
            )
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src={Spinner} alt="Loading" />
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                    <button
                        className="primary-btn text-white px-4 py-2 rounded"
                        onClick={() => setShowAddTaskPopup(true)}
                    >
                        Add Task
                    </button>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Background Image Placeholder */}
                            <div className="bg-gray-300 flex items-center justify-center">
                                <img
                                    src={Mathbg}
                                    alt={task.title}
                                    className="h-24 w-full relative"
                                />
                            </div>

                            {/* Task Content */}
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800 truncate">{task.title}</h2>
                                <p className="text-sm text-gray-600 truncate">{task.topic}</p>
                                <p className="text-sm text-gray-500 mt-2">Created: {new Date(task.created_at).toLocaleDateString()}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-around items-center p-4">
                                <motion.div
                                    className="flex items-center justify-center group cursor-pointer"
                                    whileHover={{ x: -10 }}
                                >
                                    <IoMdEye className="text-gray-600 text-xl group-hover:text-blue-500 transition-colors" />
                                    <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all">
                                        View
                                    </span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center justify-center group cursor-pointer"
                                    whileHover={{ x: -10 }}
                                    onClick={() => showEditPopup(task)}
                                >
                                    <BiEdit className="text-gray-600 text-xl group-hover:text-blue-500 transition-colors" />
                                    <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all">
                                        Edit
                                    </span>
                                </motion.div>


                                <motion.div
                                    className="flex items-center justify-center group cursor-pointer"
                                    whileHover={{ x: -10 }}
                                    onClick={() => showDeletePopup(task)}
                                >
                                    <IoMdTrash className="text-gray-600 text-xl group-hover:text-red-500 transition-colors" />
                                    <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-red-500 transition-all">
                                        Delete
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Task Popup */}
            {showAddTaskPopup && (
                <AddTask
                    class_id={class_id}
                    onClose={() => {
                        setShowAddTaskPopup(false);
                        fetchTasks();
                    }}
                />
            )}

            {/* Edit Task Popup */}
            {isEditPopupVisible && (
                <EditTask
                    task={taskToEdit}
                    onClose={hideEditPopup}
                    onUpdate={handleTaskUpdate}
                />
            )}
            {/* Delete Confirmation Popup */}
            {isDeletePopupVisible && (
                <DeleteItem
                    itemName={taskToDelete.title}
                    onDelete={handleDeleteTask}
                    onCancel={hideDeletePopup}
                />
            )}
        </>
    );
};

export default T_TasksView;
