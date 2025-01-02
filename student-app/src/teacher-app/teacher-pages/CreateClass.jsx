import React, { useState } from "react";

const CreateClass = () => {
  const [activeTab, setActiveTab] = useState("courseLanding");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create a New Course</h1>
        {/* Submit Button */}
        <div className="flex justify-center items-center">
          <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
            Submit
          </button>
        </div>      </div>


      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === "curriculum"
            ? "text-black border-b-2 border-black"
            : "text-gray-500 hover:text-black"
            }`}
          onClick={() => handleTabChange("curriculum")}
        >
          Curriculum
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === "courseLanding"
            ? "text-black border-b-2 border-black"
            : "text-gray-500 hover:text-black"
            }`}
          onClick={() => handleTabChange("courseLanding")}
        >
          Course Landing Page
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === "settings"
            ? "text-black border-b-2 border-black"
            : "text-gray-500 hover:text-black"
            }`}
          onClick={() => handleTabChange("settings")}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 shadow rounded-lg">
        {activeTab === "curriculum" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Curriculum</h2>
            <p>Curriculum form will go here.</p>
          </div>
        )}

        {activeTab === "courseLanding" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Course Landing Page</h2>
            <form className="space-y-6">
              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>

              {/* Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Language
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                ></textarea>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pricing
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
            </form>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <p>Settings form will go here.</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default CreateClass;
