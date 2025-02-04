import React, { useState } from "react";
import T_Sidebar from "../teacher-components/T_Sidebar"; 
import DashboardView from "../teacher-components/DashboardView"; 
import AllStudents from "../teacher-components/AllStudents"; 
import T_ClassesView from "../teacher-components/T_ClassesView";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <T_Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6 ml-[250px]">
        {activeTab === "dashboard" && (
          <div>
          {/* <h1 className="font-bold text-2xl">Dashboard</h1> */}
            <DashboardView />
          </div>
        )}
        {activeTab === "classes" && (
          <div>
            <T_ClassesView />
          </div>
        )}
        {/* {activeTab === "students" && (
          <div>
            <AllStudents />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Dashboard;
