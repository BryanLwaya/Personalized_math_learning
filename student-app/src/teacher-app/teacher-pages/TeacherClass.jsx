import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import T_TasksView from "../teacher-components/T_TaskView";
import { BiLogOut } from "react-icons/bi";
import Spinner from "../../assets/Spinner.gif";
import EnrolledStudents from "../teacher-components/EnrolledStudents";
import Tr_TaskSidebar from "../teacher-components/Tr_TaskSidebar";

const TeacherClass = () => {
    const { class_id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [activeTab, setActiveTab] = useState("tasks");
    const [classDetails, setClassDetails] = useState(null);
    const [teacherName, setTeacherName] = useState("");
    const [initials, setInitials] = useState("");

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/class/${class_id}`);
                setClassDetails(response.data);
            } catch (error) {
                console.error("Error fetching class details:", error);
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

        fetchClassDetails();
        fetchTeacherDetails();
    }, [auth.user_id, class_id]);

    if (!classDetails) {
        return (
            <div className="flex items-center justify-center h-screen">
                {
                    <img src={Spinner} alt="" /> ||
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500">
                        <span className="sr-only">Loading</span>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className="flex h-screen">
         <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* Sidebar */}
            <Tr_TaskSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            classDetails={classDetails}    
            />

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 ml-[250px]">
                {/* Header Section */}
                <div className="flex justify-between items-center px-6 py-4 border-b-2 ">
                    <div></div>
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

                <div className="flex-1 p-6">
                    {activeTab === "tasks" && <T_TasksView class_id={class_id} />}
                    {/* {activeTab === "students" && (
                        <EnrolledStudents classId={class_id} />
                    )} */}

                    {/* {activeTab === "comments" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Comments</h2>
                            <p>Comments section will be displayed here.</p>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default TeacherClass;
