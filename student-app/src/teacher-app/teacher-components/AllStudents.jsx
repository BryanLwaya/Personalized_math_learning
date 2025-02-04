import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext"; 
import axios from "axios";

const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@gmail.com",
    course: "React & Redux Complete Course 2024",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@gmail.com",
    course: "Next JS Full Course 2025",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@gmail.com",
    course: "CSS Full Course 2025",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@gmail.com",
    course: "Python Full Course 2025",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    course: "HTML Full Course 2025",
  },
];

const AllStudents = () => {
  const { auth } = useAuth(); 
  const [teacherName, setTeacherName] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
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
    fetchTeacherDetails();
}, [auth.user_id]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>

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

      {/* Students List */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-bold mb-4">All Students</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Enrolled Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{student.name}</td>
                <td className="py-2 px-4 border-b">{student.email}</td>
                <td className="py-2 px-4 border-b">{student.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudents;
