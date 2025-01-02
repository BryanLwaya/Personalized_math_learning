import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        access_token: null,
        user_id: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedUserId = localStorage.getItem("user_id");

        if (storedToken && storedUserId) {
            setAuth({ isAuthenticated: true, access_token: storedToken, user_id: storedUserId });
        }
    }, []);

    const login = (token, userId) => {
        setAuth({ isAuthenticated: true, access_token: token, user_id: userId });
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_id", userId);
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, access_token: null, user_id: null });
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id"); 
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
