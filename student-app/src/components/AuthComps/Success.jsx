import React from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css';
import VerifyImg from '../../assets/verify.jpg';


const Success = () => {
    const navigate = useNavigate();

    const handleProceed = () => {
        navigate('/login');
    };

    return (
        <div className="success-page flex items-center justify-center min-h-screen bg-gray-100">
            <div className="success-container bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="popup-bg h-48 w-full bg-cover flex justify-center">
                    <img src={VerifyImg} alt="" />
                </div>
                <div className="success-content mt-4">
                    <h2 className="text-2xl font-bold text-gray-800">Email Verified Successfully!</h2>
                    <p className="mt-2 text-gray-600">
                        Your email has been successfully verified. You can now log in to your account.
                    </p>
                    <button
                        className="primary-btn mt-4 px-6 py-2 rounded text-white transition"
                        onClick={handleProceed}
                    >
                        Proceed to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
