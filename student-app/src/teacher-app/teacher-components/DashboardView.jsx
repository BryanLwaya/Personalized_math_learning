import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import Spinner from "../../assets/Spinner.gif";
import axios from "axios";

const DashboardView = () => {
    const { auth } = useAuth(); 
    const [teacherName, setTeacherName] = useState("");
    const [initials, setInitials] = useState("");
    const [dashboardData, setDashboardData] = useState({
        classes: [],
        students: [],
        tasks: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTeacherDashboard = async () => {
            setIsLoading(true);
            if (auth.user_id) {
                try {
                    const userResponse = await axios.get(`http://localhost:5000/users/${auth.user_id}`);
                    const { name } = userResponse.data;
                    setTeacherName(`Tr. ${name}`);
                    const nameParts = name.split(" ");
                    const userInitials =
                        nameParts.length > 1
                            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
                            : name[0].toUpperCase();
                    setInitials(userInitials);

                    // Fetch dashboard data
                    const dashboardResponse = await axios.get(`http://localhost:5000/teacher/dashboard/${auth.user_id}`);
                    setDashboardData(dashboardResponse.data);
                    setErrorMessage("");
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                    setErrorMessage("Failed to load dashboard data.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchTeacherDashboard();
    }, [auth.user_id]);


    if (isLoading) {
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

    // if (errorMessage) {
    //     return (
    //         <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
    //             <p className="text-red-500">{errorMessage}</p>
    //         </div>
    //     );
    // }

    const { classes, students, tasks } = dashboardData;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

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

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Total Students</h2>
                    <p className="text-3xl font-bold text-gray-800">{students.length}</p>
                </div>
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Total Classes</h2>
                    <p className="text-3xl font-bold text-gray-800">{classes.length}</p>
                </div>
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Total Tasks</h2>
                    <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
                </div>
            </div>

            {/* Classes List
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-lg font-bold mb-4">Classes</h2>
                {classes.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left text-sm font-medium text-gray-600">
                                <th className="py-2 px-4 border-b">Class Name</th>
                                <th className="py-2 px-4 border-b">Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classItem) => (
                                <tr key={classItem._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{classItem.class_name}</td>
                                    <td className="py-2 px-4 border-b">
                                        {
                                            students.filter(student =>
                                                dashboardData.enrollments.some(
                                                    enrollment => enrollment.class_id === classItem._id &&
                                                        enrollment.student_id === student._id
                                                )
                                            ).length
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No classes available.</p>
                )}
            </div> */}

            {/* Tasks List */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-lg font-bold mb-4">Tasks</h2>
                {tasks.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left text-sm font-medium text-gray-600">
                                <th className="py-2 px-4 border-b">Task Title</th>
                                <th className="py-2 px-4 border-b">Class Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => {
                                const className = classes.find(
                                    (cls) => cls._id === task.class_id
                                )?.class_name || "N/A";

                                return (
                                    <tr key={task._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{task.title}</td>
                                        <td className="py-2 px-4 border-b">{className}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No tasks available.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardView;
