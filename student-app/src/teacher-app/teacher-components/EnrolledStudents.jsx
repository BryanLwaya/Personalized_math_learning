import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../assets/Spinner.gif";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Tr_TaskSidebar from "./Tr_TaskSidebar";

const EnrolledStudents = () => {
  const { class_id: classId } = useParams();
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [classDetails, setClassDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [teacherName, setTeacherName] = useState("");
  const [initials, setInitials] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/class/${classId}`);
        console.log("Class Data: ", response.data);
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

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/class/${classId}/students`
        );
        setStudents(response.data.students);
        // console.log(response.data.students);
      } catch (err) {
        setError("Failed to fetch students. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
    fetchTeacherDetails();
    fetchStudents();
  }, [classId]);

  const navigate = useNavigate();

  if (!classDetails && !teacherName) {
    setIsLoading(true);
  }

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

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Tr_TaskSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        classDetails={classDetails}
      />
      <div className="flex-1 bg-gray-100 ml-[250px]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 ">
          <h1 className="text-xl font-bold">Enrolled Students</h1>

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

        <div className="p-6">
          <div className="flex justify-between items-center px-4 mb-3">
            <h2 className="text-lg font-bold text-gray-700">Name</h2>
            <h2 className="text-lg font-bold text-gray-700">Performance</h2>
          </div>
          <ul className="space-y-4">
            {students.map((student) => (
              <li key={student._id} className="p-4 bg-white shadow rounded flex justify-between">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-gray-500 text-sm">{student.email}</p>
                </div>
                <button
                  onClick={() => navigate(`/teacher/performance/${student._id}/${classId}`)}
                  className="primary-btn text-white px-4 py-2 rounded"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStudents;