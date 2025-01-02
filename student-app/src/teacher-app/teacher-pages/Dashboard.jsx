import React, { useState } from "react";
import T_Sidebar from "../teacher-components/T_Sidebar"; 
import DashboardView from "../teacher-components/DashboardView"; 
import TeacherClasses from "../teacher-components/TeacherClasses";
import AllStudents from "../teacher-components/AllStudents"; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex">
      {/* Sidebar */}
      <T_Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        {activeTab === "dashboard" && (
          <div>
          {/* <h1 className="font-bold text-2xl">Dashboard</h1> */}
            <DashboardView />
          </div>
        )}
        {activeTab === "classes" && (
          <div>
            <TeacherClasses />
          </div>
        )}
        {activeTab === "students" && (
          <div>
            <AllStudents />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
