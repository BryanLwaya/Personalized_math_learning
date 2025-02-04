import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import StudentSidebar from "./StudentSidebar";
import StudentTasks from "./StudentTasks";
import Spinner from "../../assets/Spinner.gif";
// import StudentPerformance from "./StudentPerformance";

const ViewClass = () => {
  const { id: class_id } = useParams();
  const { auth } = useAuth();
  const [classDetails, setClassDetails] = useState(null);
  const [userInitials, setUserInitials] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    const fetchUserClassDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/class/${class_id}`);
        setClassDetails(response.data);

        const userResponse = await axios.get(`http://localhost:5000/users/${auth.user_id}`);

        const initials = userResponse.data.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase();
        setUserInitials(initials);
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    };

    fetchUserClassDetails();
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
      {/* Sidebar */}
      <StudentSidebar
        classDetails={classDetails}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        class_id={class_id}
        classname={"fixed left-0 top-0"}
      />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 ml-[250px]">
        {/* Header Section */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2">
          <div>
            <h1 className="text-2xl font-bold">
              {activeTab === "tasks" && "Tasks"}
              {/* {activeTab === "performance" && "Performance"} */}
              {activeTab === "comments" && "Comments"}
            </h1>
          </div>
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-white font-bold"
            title="Your Initials"
          >
            {userInitials}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeTab === "tasks" && (
            <StudentTasks class_id={class_id} classDetails={classDetails} />
          )}
          {/* {activeTab === "performance" && (

            <StudentPerformance studentId={auth.user_id} />

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

export default ViewClass;
