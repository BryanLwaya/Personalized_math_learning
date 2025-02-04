import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoinClass = () => {
    const [classCode, setClassCode] = useState("");
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleJoinClass = async (e) => {
        e.preventDefault();

        if (!classCode) {
            toast.error("Please enter a class code.");
            return;
        }

        try {
            const payload = {
                student_id: auth.user_id,
                class_code: classCode,
            };

            const response = await axios.post("http://localhost:5000/enrollments/join", payload);

            if (response.status === 201) {
                toast.success("Successfully joined the class!");
                navigate("/classes");
            }
        } catch (error) {
            console.error("Error joining class:", error);
            toast.error(
                error.response?.data?.message || "Failed to join class. Please try again."
            );
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <section className="std_signup">
                <button className="flex space-x-4 items-center justify-around bg-gray-200 hover:bg-gray-300 w-fit rounded px-4 py-2 delay-200 ease-in-out transition-all" 
                onClick={() => navigate("/classes")}
                >
                <IoMdArrowBack />
                </button>
                <div className="container grid grid-cols-1 md:flex px-0 w-[400px] h-full md:w-[850px] md:h-[450px] md:mt-10 mt-[10%]" id="container">
                    <div className="form-container sign-in-container w-full md:w-[80%]">
                        <form onSubmit={handleJoinClass}>
                            <h1 className="text-dark text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-10">
                                Join a Class
                            </h1>
                            <p className="text-dark2 mb-2">Enter your Class Code</p>
                            <div className="infield w-[100%]">
                                <input
                                    type="text"
                                    placeholder="Class Code"
                                    name="classCode"
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value)}
                                />
                                <label></label>
                            </div>
                            <button
                                type="submit"
                                className="primary-btn w-[50%] text-[15px] uppercase mb-5"
                            >
                                Join
                            </button>
                        </form>
                    </div>

                    <div className="overlay-container" id="overlayCon">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className="text-white text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-8">
                                    Hello There!
                                </h1>
                                <p>
                                    Ready to start a new Math journey? Enter the Code given by your
                                    Teacher
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default JoinClass;
