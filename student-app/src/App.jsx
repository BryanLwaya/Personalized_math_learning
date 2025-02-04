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
import TeacherClass from "./teacher-app/teacher-pages/TeacherClass";
import ViewSingleTask from "./pages/ViewClass/ViewSingleTask";
import TrPerformanceView from "./teacher-app/teacher-pages/TrPerformanceView";
import StudentPerformance from "./pages/ViewClass/StudentPerformance";
import EnrolledStudents from "./teacher-app/teacher-components/EnrolledStudents";
import TeacherComments from "./teacher-app/teacher-pages/TeacherComments";
import StudentComments from "./pages/ViewClass/StudentComments";


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ******************* Public Routes ********************* */}
          <Route index element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-mail" element={<Verify />} />
          <Route path="/success" element={<Success />} />
          <Route path="/auth-error" element={<AuthError />} />

          {/*******************  Protected Routes *****************/}
          {/* Student Routes */}
          <Route path="/classes" element={<PrivateRoute><Classes /></PrivateRoute>} />
          <Route path="/view-class/:id" element={<PrivateRoute><ViewClass /></PrivateRoute>} />
          <Route path="/join-class" element={<PrivateRoute><JoinClass /></PrivateRoute>} />
          <Route path="/view-task/:task_id" element={<PrivateRoute><ViewSingleTask /></PrivateRoute>} />
          <Route path="/student/performance/:class_id" element={<PrivateRoute><StudentPerformance /></PrivateRoute>} />
          <Route path="/student/comments/:class_id" element={<PrivateRoute><StudentComments /></PrivateRoute>} />


          {/* Teacher Routes */}
          <Route path="/teacher-dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-class" element={<PrivateRoute><CreateClass /></PrivateRoute>} />
          <Route path="/teacher-class/:class_id" element={<PrivateRoute><TeacherClass /></PrivateRoute>} />
          <Route path="/teacher/enrolled/:class_id" element={<PrivateRoute><EnrolledStudents /></PrivateRoute>} />
          <Route path="/teacher/performance/:student_id/:class_id" element={<PrivateRoute><TrPerformanceView /></PrivateRoute>} />
          <Route path="/teacher/comments/:class_id" element={<PrivateRoute><TeacherComments /></PrivateRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NoPath />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
