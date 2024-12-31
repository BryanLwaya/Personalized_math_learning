import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiMath } from "react-icons/bi";
import { IoMdHappy } from "react-icons/io";

const EnrolledClasses = [
  {
    id: 1,
    title: "Solve Equations",
    subTopic: "Equations Basics",
    teacher: "Mr. John Doe",
    link: "/view-class/1",
    icon: <BiMath />,
  },
  {
    id: 2,
    title: "Understand Questions",
    subTopic: "Critical Thinking",
    teacher: "Ms. Jane Smith",
    link: "/view-class/2",
    icon: <IoMdHappy />,
  },
];

const Sidebar = ({ classes }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  return (
    <div className="h-screen w-64 bg-[#f1f1f1] text-black flex flex-col justify-between drop-shadow-lg">
      {/* Top Section */}
      <div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">MathGoal</h1>
        </div>
        <div className="mt-4">
          {/* My Classes Dropdown */}
          <div
            className="p-4 cursor-pointer hover:bg-primary hover:bg-opacity-70 transition-all duration-500 ease-in-out"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-lg font-semibold">My Classes</span>
          </div>
          {isDropdownOpen && (
            <ul className="space-y-0">
              {classes.map((classItem) => (
                <li
                  key={classItem.id}
                  className="flex items-center p-3 cursor-pointer transition relative hover:bg-primary hover:bg-opacity-20 hover:text-black"
                >
                  <span className="mr-3">{classItem.icon}</span>
                  <span className="flex-grow">{classItem.title}</span>
                  <div className="absolute top-0 right-0 h-full w-1 bg-primary opacity-0 hover:opacity-100 transition" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <a
          href="/"
          className="p-4 flex items-center hover:bg-primary hover:bg-opacity-20 transition-all duration-500"
        >
          <span className="mr-3">🏠</span>
          <span>Home</span>
        </a>
      </div>
    </div>
  );
};

const Classes = () => {
  const navigate = useNavigate(); // Use navigate hook

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar classes={EnrolledClasses} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <div className="flex items-center space-x-4">
            <button
              className="primary-btn text-white px-4 py-2 rounded"
              onClick={() => navigate("/join-class")} // Navigate to /join-class
            >
              Join a Class
            </button>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {EnrolledClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Class Image */}
              <div className="h-40 bg-gray-300">
                <img
                  src="https://via.placeholder.com/300" // Placeholder image
                  alt={classItem.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Class Content */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {classItem.title}
                </h2>
                <p className="text-sm text-gray-600">{classItem.subTopic}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Teacher: {classItem.teacher}
                </p>
              </div>

              {/* View Class Button */}
              <div className="px-4 pb-4">
                <button
                  className="bg-primary text-white px-4 py-2 rounded primary-btn transition w-full"
                  onClick={() => navigate(classItem.link)}
                >
                  View Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;
