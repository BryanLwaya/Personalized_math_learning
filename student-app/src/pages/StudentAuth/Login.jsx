import React, { useState, useEffect } from 'react';
import './std_auth.css';
import Navbar from '../../components/NavBar/NavBar';
import { MdError } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Verify from '../../components/AuthComps/Verify'; // Import Verify popup
import { useAuth } from '../../AuthContext'; // Import AuthContext for login

const Login = () => {
    const navigate = useNavigate();
    const { login, auth } = useAuth(); 
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/classes');
        }
    }, [auth, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrorMessage(''); // Clear error message on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData);

            if (response.data.access_token) {
                login(response.data.access_token, response.data.user_id);
                navigate('/classes');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setShowVerifyPopup(true);
            } else {
                setErrorMessage(
                    error.response?.data?.message || 'Invalid email or password. Please try again.'
                );
            }
        }
    };

    return (
        <>
            <Navbar />
            <section className='std_signup'>
                <div className="container grid grid-cols-1 md:flex px-0 w-[400px] h-full md:w-[850px] md:h-[450px] md:mt-10 mt-[10%]" id="container">
                    <div className="form-container sign-in-container w-full md:w-[60%]">
                        <form onSubmit={handleSubmit}>
                            <h1 className='text-dark text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-10'>Login</h1>
                            <p className='text-dark2 mb-2'>Enter to Continue Learning</p>
                            {/* Error Message */}
                            {errorMessage && (
                                <div className="error-message text-red-500 text-sm mb-4 flex items-center">
                                    <MdError className="text-red-500 mr-2" />
                                    {errorMessage}
                                </div>
                            )}
                            <div className="infield w-[100%]">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className={`border ${errorMessage ? 'border-2 border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                                <label></label>
                            </div>
                            <div className="infield w-[100%] mt-4">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className={`border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                                <label></label>
                            </div>
                            <button
                                type="submit"
                                className='primary-btn w-[50%] text-[15px] uppercase mt-4 mb-5'>
                                Login
                            </button>
                        </form>
                    </div>
                    <div className="overlay-container" id="overlayCon">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className='text-white text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-8'>Don't have an Account?</h1>
                                <p>Click here to create a new account</p>
                                <a href="/signup">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verify Popup */}
            {showVerifyPopup && <Verify onClose={() => setShowVerifyPopup(false)} />}
        </>
    );
};

export default Login;
