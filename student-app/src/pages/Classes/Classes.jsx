import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMath } from "react-icons/bi";
import { useAuth } from "../../AuthContext"; 
import { CiLogout } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import Classbg from "../../assets/class_bg.jpg";

const Sidebar = ({ classes, userName }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });

      logout(); // Call the logout method from AuthContext
    } catch (error) {
      logout();
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
            {isDropdownOpen ? (
              <IoIosArrowDown className="ml-2" />
            ) : (
              <MdKeyboardArrowRight className="ml-2" />
            )}
          </div>
          {isDropdownOpen && (
            <ul className="space-y-0">
              {classes.map((classItem) => (
                <li
                  key={classItem._id}
                  className="flex items-center px-3 py-2 mb-2 mx-3 cursor-pointer transition relative bg-gray-200 rounded-lg hover:bg-secondary hover:bg-opacity-30 hover:text-black"
                  onClick={() => navigate(`/view-class/${classItem._id}`)}
                >
                  <span className="mr-3">{classItem.icon || <BiMath />}</span>
                  <span className="flex-grow">{classItem.class_name}</span>
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
          <CiLogout className="mr-4 " />
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
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    const fetchUserAndClasses = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5000/users/${auth.user_id}`);
        setUserName(userResponse.data.name);

        const initials = userResponse.data.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase();
        setUserInitials(initials);

        // Fetch enrolled classes
        const enrollmentResponse = await axios.get(`http://localhost:5000/enrollments/${auth.user_id}`);
        setEnrolledClasses(enrollmentResponse.data);
      } catch (error) {
        console.error("Error fetching user or class data:", error);
      }
    };

    if (auth.user_id) {
      fetchUserAndClasses();
    }
  }, [auth.user_id]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar classes={enrolledClasses} userName={userName} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
          <div className="flex items-center space-x-4">
            <button
              className="primary-btn text-white px-4 py-2 rounded"
              onClick={() => navigate("/join-class")}
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
          {enrolledClasses.map((classItem) => (
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
                <h2 className="text-lg font-bold text-gray-800">
                  {classItem.class_name}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Teacher: {classItem.teacher_name || "N/A"}
                </p>
              </div>

              {/* View Class Button */}
              <div className="px-4 pb-4">
                <button
                  className="bg-primary text-white px-4 py-2 rounded primary-btn transition w-full"
                  onClick={() => navigate(`/view-class/${classItem._id}`)}
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
