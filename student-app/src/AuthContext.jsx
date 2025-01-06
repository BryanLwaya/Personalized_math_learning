import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        access_token: null,
        user_id: null,
        role: null, // Added role
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        const storedUserId = localStorage.getItem("user_id");
        const storedRole = localStorage.getItem("role"); // Retrieve role from localStorage

        if (storedToken && storedUserId && storedRole) {
            setAuth({
                isAuthenticated: true,
                access_token: storedToken,
                user_id: storedUserId,
                role: storedRole,
            });
        }
    }, []);

    const login = (token, userId, role) => {
        setAuth({ isAuthenticated: true, access_token: token, user_id: userId, role });
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("role", role); // Store role
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, access_token: null, user_id: null, role: null });
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role"); // Clear role
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
