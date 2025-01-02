import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMath } from "react-icons/bi";
import { IoMdHappy } from "react-icons/io";
import { useAuth } from "../../AuthContext"; 
import { CiLogout } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";

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

const Sidebar = ({ classes, userName }) => {
  const { auth, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });

      // Call the logout method from AuthContext
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="h-screen w-64 bg-[#fff] text-black flex flex-col justify-between drop-shadow-lg">
      {/* Top Section */}
      <div>
        <div className="px-4 pt-5">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {userName.split(" ")[0]}
          </h1>
        </div>
        <div className="mt-3">
          {/* My Classes Dropdown */}
          <div
            className="flex items-center px-4 py-2 mb-1 cursor-pointer hover:bg-gray-400 hover:bg-opacity-30 transition-all duration-500 ease-in-out"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-lg font-semibold">My Classes</span>
            {
              isDropdownOpen ? <IoIosArrowDown className="ml-2"/> : <MdKeyboardArrowRight className="ml-2"/> 
            }
            
          </div>
          {isDropdownOpen && (
            <ul className="space-y-0">
              {classes.map((classItem) => (
                <li
                  key={classItem.id}
                  className="flex items-center px-3 py-2 mb-2 mx-3 cursor-pointer transition relative bg-gray-200 rounded-lg hover:bg-secondary hover:bg-opacity-30 hover:text-black"
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
      <div className="w-full flex justify-start px-4 pb-3">
        <button
          onClick={handleLogout}
          className="py-3 px-2 flex items-center font-semibold rounded-md w-[90%] hover:bg-red-500 hover:text-white transition-all duration-500"
        >
          <CiLogout className="mr-4 "/>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Classes = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [userInitials, setUserInitials] = useState("U");
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${auth.user_id}`);

        // Set user's full name
        setUserName(response.data.name);

        // Set user's initials
        const initials = response.data.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase();
        setUserInitials(initials);
      } catch (error) {
        console.error("Error fetching user data:", error); // Log errors
      }
    };

    if (auth.user_id) {
      fetchUser();
    } else {
      console.warn("No user ID found in context");
    }
  }, [auth.user_id]);


  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar classes={EnrolledClasses} userName={userName} />

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
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-white text-lg font-semibold border border-gray-300">
              {userInitials || ""}
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
