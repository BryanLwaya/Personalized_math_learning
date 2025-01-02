import React from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css';
import VerifyImg from '../../assets/verify.jpg';

const Verify = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/login'); 
        window.location.reload();
    };

    return (
        <div className="verify-popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="popup-container bg-white p-6 rounded-lg shadow-lg relative text-center">
                {/* Close Button */}
                <button
                    className="close-btn absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={handleClose}
                >
                    &times;
                </button>
                {/* Popup Content */}
                <div className="popup-bg h-48 w-full bg-cover flex justify-center">
                    <img src={VerifyImg} alt="Verify Email" className="object-cover h-full" />
                </div>
                <div className="popup-content mt-4">
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
                    <p className="mt-2 text-gray-600">
                        A verification link has been sent to your email. Please verify your email to continue.
                    </p>
                    <button
                        className="primary-btn mt-4 px-6 py-2 rounded text-white transition"
                        onClick={handleClose}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Verify;
