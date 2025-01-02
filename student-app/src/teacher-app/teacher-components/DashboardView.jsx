import React from "react";

const courses = [
    {
        id: 1,
        name: "React & Redux Complete Course 2024",
        students: 5,
        lessons: 12,
    },
    {
        id: 2,
        name: "Next JS Full Course 2025",
        students: 8,
        lessons: 15,
    },
    {
        id: 3,
        name: "CSS Full Course 2025",
        students: 3,
        lessons: 10,
    },
    {
        id: 4,
        name: "Python Full Course 2025",
        students: 10,
        lessons: 20,
    },
    {
        id: 5,
        name: "HTML Full Course 2025",
        students: 7,
        lessons: 8,
    },
];

const DashboardView = () => {
    const totalStudents = courses.reduce((acc, course) => acc + course.students, 0);
    const totalLessons = courses.reduce((acc, course) => acc + course.lessons, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Total Students</h2>
                    <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
                </div>
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Total Lessons</h2>
                    <p className="text-3xl font-bold text-gray-800">{totalLessons}</p>
                </div>
            </div>

            {/* Courses List */}
            <div className="bg-white shadow rounded p-6">
                <h2 className="text-lg font-bold mb-4">Courses</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-sm font-medium text-gray-600">
                            <th className="py-2 px-4 border-b">Course Name</th>
                            <th className="py-2 px-4 border-b">Students</th>
                            <th className="py-2 px-4 border-b">Lessons</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{course.name}</td>
                                <td className="py-2 px-4 border-b">{course.students}</td>
                                <td className="py-2 px-4 border-b">{course.lessons}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardView;
