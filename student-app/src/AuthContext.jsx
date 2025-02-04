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
        const storedToken = sessionStorage.getItem("access_token");
        const storedUserId = sessionStorage.getItem("user_id");
        const storedRole = sessionStorage.getItem("role"); // Retrieve role from sessionStorage

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
        sessionStorage.setItem("access_token", token);
        sessionStorage.setItem("user_id", userId);
        sessionStorage.setItem("role", role); // Store role in sessionStorage
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, access_token: null, user_id: null, role: null });
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("role"); // Clear role from sessionStorage
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
