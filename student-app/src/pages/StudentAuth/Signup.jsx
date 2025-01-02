import React, { useState } from 'react';
import './std_auth.css';
import Navbar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false); // For button loading state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/auth/register', formData);
            if (response.status === 201) {
                // alert('Registration successful! Please verify your email.');
                navigate('/verify-mail');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className="std_signup">
                <div className="container grid grid-cols-1 md:flex px-0 w-[400px] h-full md:w-[850px] md:h-[450px] md:mt-10 mt-[10%]" id="container">
                    <div className="form-container sign-in-container w-full md:w-[60%]">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-dark text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-10">Sign Up</h1>
                            <p className="text-dark2 mb-2">Enter your details below</p>
                            <div className="infield w-[100%]">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label></label>
                            </div>
                            <div className="infield w-[100%]">
                                <input
                                    type="email"
                                    placeholder="Your Email/Parent Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label></label>
                            </div>
                            <div className="infield w-[100%]">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label></label>
                            </div>
                            <button
                                type="submit"
                                className="primary-btn w-[50%] text-[15px] uppercase mb-5"
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                    <div className="overlay-container" id="overlayCon">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className="text-white text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-8">
                                    Already Have an Account?
                                </h1>
                                <p>Click here to login.</p>
                                <a href="/login">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Signup;
