import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { IoMdTrash, IoMdEye } from "react-icons/io";
import { motion } from "framer-motion";
import { useAuth } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Classbg from "../../assets/class_bg.jpg";
import Spinner from "../../assets/Spinner.gif";
import DeleteItem from "./DeleteItem";

const T_ClassesView = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [teacherName, setTeacherName] = useState("");
    const [initials, setInitials] = useState("");
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [studentsCount, setStudentsCount] = useState({});
    const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeacherDetails = async () => {
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
    };

    const fetchTeacherClasses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/classes/${auth.user_id}`);
            const classes = response.data;
            setTeacherClasses(classes);

            // Fetch student count for each class
            const studentCounts = {};
            for (const classItem of classes) {
                try {
                    const studentsResponse = await axios.get(
                        `http://localhost:5000/class/${classItem._id}/students`
                    );
                    studentCounts[classItem._id] = studentsResponse.data.students.length;
                } catch (error) {
                    console.error(`Error fetching students for class ${classItem._id}:`, error);
                    studentCounts[classItem._id] = 0; // Default to 0 if there is an error
                }
            }
            setStudentsCount(studentCounts);
        } catch (error) {
            console.error("Error fetching teacher classes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const showDeletePopup = (classItem) => {
        setClassToDelete(classItem);
        setDeletePopupVisible(true);
    };

    const hideDeletePopup = () => {
        setDeletePopupVisible(false);
        setClassToDelete(null);
    };

    const handleDeleteClass = async () => {
        if (!classToDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/class/${classToDelete._id}`);
            toast.success(response.data.message);
            // setTeacherClasses((prevClasses) =>
            //     prevClasses.filter((c) => c._id !== classToDelete._id)
            // );
            fetchTeacherClasses();
        } catch (error) {
            console.error("Error deleting class:", error);
            toast.error("Failed to delete class. Please try again.");
        } finally {
            hideDeletePopup();
        }
    };

    useEffect(() => {
        if (auth.user_id) {
            fetchTeacherDetails();
            fetchTeacherClasses();
        }
    }, [auth.user_id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src={Spinner} alt="Loading" />
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            className="primary-btn text-white px-4 py-2 rounded"
                            onClick={() => navigate("/create-class")}
                        >
                            Create a Class
                        </button>
                        <span className="text-gray-800 text-lg font-semibold">{teacherName}</span>
                        <div
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white font-bold"
                            title={teacherName}
                        >
                            {initials}
                        </div>
                    </div>
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teacherClasses.map((classItem) => (
                        <div
                            key={classItem._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Class Image */}
                            <div className="h-40 bg-gray-300">
                                <img
                                    src={Classbg}
                                    alt={classItem.class_name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Class Content */}
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800 truncate">{classItem.class_name}</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Students Enrolled: {studentsCount[classItem._id] || "0"}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-around items-center p-4 pl-9">
                                {/* View Button */}
                                <motion.div
                                    className="flex items-center justify-center group cursor-pointer"
                                    whileHover={{ x: -10 }}
                                    onClick={() => navigate(`/teacher-class/${classItem._id}`)}
                                >
                                    <IoMdEye className="text-gray-600 text-xl group-hover:text-blue-500 transition-colors" />
                                    <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all">
                                        View
                                    </span>
                                </motion.div>

                                {/* Delete Button */}
                                <motion.div
                                    className="flex items-center justify-center group cursor-pointer"
                                    whileHover={{ x: -10 }}
                                    onClick={() => showDeletePopup(classItem)}
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
            {/* Delete Confirmation Popup */}
            {isDeletePopupVisible && (
                <DeleteItem
                    itemName={classToDelete.class_name}
                    onDelete={handleDeleteClass}
                    onCancel={hideDeletePopup}
                />
            )}
        </>
    );
};

export default T_ClassesView;