import React from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { IoMdTrash, IoMdEye } from "react-icons/io";
import { motion } from "framer-motion";

const teacherClasses = [
    {
        id: 1,
        title: "React & Redux Complete Course 2024",
        subTopic: "Learn React and Redux",
        students: 5,
        image: "https://via.placeholder.com/300", // Placeholder image
    },
    {
        id: 2,
        title: "Next JS Full Course 2025",
        subTopic: "Master Server-Side Rendering",
        students: 8,
        image: "https://via.placeholder.com/300",
    },
    {
        id: 3,
        title: "CSS Full Course 2025",
        subTopic: "Advanced CSS Techniques",
        students: 3,
        image: "https://via.placeholder.com/300",
    },
    {
        id: 4,
        title: "Python Full Course 2025",
        subTopic: "Learn Python from Scratch",
        students: 10,
        image: "https://via.placeholder.com/300",
    },
];

const TeacherClasses = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
                <button
                    className="primary-btn text-white px-4 py-2 rounded"
                    onClick={() => navigate("/create-class")}
                >
                    Create New Class
                </button>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teacherClasses.map((classItem) => (
                    <div
                        key={classItem.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        {/* Class Image */}
                        <div className="h-40 bg-gray-300">
                            <img
                                src={classItem.image}
                                alt={classItem.title}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Class Content */}
                        <div className="p-4">
                            <h2 className="text-lg font-bold text-gray-800 overflow-clip text-nowrap truncate">
                                {classItem.title}
                            </h2>
                            <p className="text-sm text-gray-600">{classItem.subTopic}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Students Enrolled: {classItem.students}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-around items-center p-4">
                            {/* View Button */}
                            <motion.div
                                className="flex items-center justify-center group rounded p-2 hover:bg-blue-500 transition-all"
                                whileHover={{ x: -5 }}
                                onClick={() => navigate(`/view-class/${classItem.id}`)}
                            >
                                <IoMdEye className="text-gray-600 group-hover:text-white text-xl transition-colors" />
                                <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all">
                                    View
                                </span>
                            </motion.div>

                            {/* Edit Button */}
                            <motion.div
                                className="flex items-center justify-center group rounded p-2 hover:bg-blue-500 transition-all"
                                whileHover={{ x: -5 }}
                                onClick={() => navigate(`/edit-class/${classItem.id}`)}
                            >
                                <BiEdit className="text-gray-600 group-hover:text-white text-xl transition-colors" />
                                <span className="text-sm text-gray-600 ml-2 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all">
                                    Edit
                                </span>
                            </motion.div>

                            {/* Delete Button */}
                                <motion.div
                                    className="flex items-center justify-center group rounded p-2 transition-all hover:bg-red-500"
                                    whileHover={{ x: -5 }}
                                    onClick={() => console.log(`Delete class ${classItem.id}`)}
                                >
                                    <IoMdTrash className="text-gray-600 group-hover:text-white text-xl transition-colors" />
                                    <span className="text-sm text-gray-600 -ml-8 group-hover:ml-2 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all">
                                        Delete
                                    </span>
                                </motion.div>
                            

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClasses;
