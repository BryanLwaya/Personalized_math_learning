import React from "react";

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
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
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
