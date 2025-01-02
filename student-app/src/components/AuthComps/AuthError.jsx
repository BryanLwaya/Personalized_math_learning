import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './verify.css';

const AuthError = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || 'Something went wrong.';

    const handleGoBack = () => {
        navigate('/signup');
    };

    return (
        <div className="error-page flex items-center justify-center min-h-screen bg-gray-100">
            <div className="error-container bg-white p-6 rounded-lg shadow-lg text-center h-[180px] w-[300px]">
                <h2 className="text-2xl font-bold text-red-600">Verification Error</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <button
                    className="primary-btn mt-4 px-6 py-2 rounded text-white bg-red-500 hover:bg-red-600 transition"
                    onClick={handleGoBack}
                >
                    Go Back to Signup
                </button>
            </div>
        </div>
    );
};

export default AuthError;
