import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const T_Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white text-black flex flex-col justify-between drop-shadow-md fixed top-0 left-0">
      {/* Top Section */}
      <div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Instructor View</h1>
        </div>
        <ul className="space-y-2">
          <li
            className={`flex items-center p-3 cursor-pointer transition hover:bg-gray-200 ${activeTab === "dashboard" ? "bg-gray-200" : ""
              }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome className="mr-3" />
            <span>Dashboard</span>
          </li>
          <li
            className={`flex items-center p-3 cursor-pointer transition hover:bg-gray-200 ${activeTab === "classes" ? "bg-gray-200" : ""
              }`}
            onClick={() => setActiveTab("classes")}
          >
            <FaChalkboardTeacher className="mr-3" />
            <span>Classes</span>
          </li>
          {/* <li
            className={`flex items-center p-3 cursor-pointer transition hover:bg-gray-200 ${
              activeTab === "students" ? "bg-gray-200" : ""
            }`}
            onClick={() => setActiveTab("students")}
          >
            <FaUserGraduate className="mr-3" />
            <span>View Students</span>
          </li> */}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <button
          className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center"
          onClick={handleLogout} // Calls the logout function
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default T_Sidebar;
