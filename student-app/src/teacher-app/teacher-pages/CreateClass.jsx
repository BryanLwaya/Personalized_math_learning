import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowBack } from "react-icons/io";

const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [classCode, setClassCode] = useState(""); // For the generated class code
  const { auth } = useAuth(); // Fetch the auth context
  const navigate = useNavigate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classCode);
    toast.success("Copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className) {
      setError("Class Name is required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/create-class",
        {
          teacher_id: auth.user_id,
          class_name: className,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage(`Class "${response.data.class_name}" Created Successfully!`);
        setClassCode(response.data.classcode);
        setClassName("");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      setError(error.response?.data?.message || "Error creating class");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <button className="flex space-x-4 items-center justify-around bg-gray-200 hover:bg-gray-300 w-fit rounded px-4 py-2 mb-3 delay-200 ease-in-out transition-all"
        onClick={() => navigate("/teacher-dashboard")}
      >
        <IoMdArrowBack /> Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Create a New Class</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Class Name Input */}
        <div>
          <label htmlFor="className" className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            id="className"
            name="className"
            value={className}
            onChange={(e) => {
              setClassName(e.target.value);
              setError("");
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            placeholder="Enter Class Name"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </form>

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{successMessage}</h2>
            <p className="text-lg text-gray-600 mb-4">
              Class Code:
              <span className="font-bold text-3xl block mt-1">{classCode}</span>
            </p>
            <div className="flex gap-4 w-full mb-4 items-center justify-center p-0">
              <button
                onClick={handleCopyCode}
                className="primary-btn text-white px-4 py-2 rounded-md transition"
              >
                Copy Code
              </button>
              <button
                onClick={() => navigate("/teacher-dashboard")}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClass;
