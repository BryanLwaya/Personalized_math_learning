import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Classes from "./pages/Classes/Classes";
import ViewClass from "./pages/ViewClass/ViewClass";
import JoinClass from "./pages/JoinClass/JoinClass";
import NoPath from "./pages/NoPath";
import Home from "./pages/Home/Home";
import SignUp from "./pages/StudentAuth/Signup";
import Login from "./pages/StudentAuth/Login";
import Dashboard from "./teacher-app/teacher-pages/Dashboard";
import CreateClass from "./teacher-app/teacher-pages/CreateClass";
import Success from "./components/AuthComps/Success";
import Verify from "./components/AuthComps/Verify";
import AuthError from "./components/AuthComps/AuthError";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-mail" element={<Verify />} />
          <Route path="/success" element={<Success />} />
          <Route path="/auth-error" element={<AuthError />} />

          {/* Protected Routes */}
          <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
          <Route path="/view-class/:id" element={<PrivateRoute><ViewClass /></PrivateRoute>} />
          <Route path="/join-class" element={<PrivateRoute><JoinClass /></PrivateRoute>} />
          <Route path="/teacher-dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-class" element={<PrivateRoute><CreateClass /></PrivateRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NoPath />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
