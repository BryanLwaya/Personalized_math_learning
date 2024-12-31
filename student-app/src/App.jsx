import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes/Classes";
import ViewClass from "./pages/ViewClass/ViewClass";
import JoinClass from "./pages/JoinClass/JoinClass";
import NoPath from "./pages/NoPath";
import Home from "./pages/Home/Home";

const EnrolledClasses = [
  {
    id: 1,
    title: "Solve Equations",
    subTopic: "Equations Basics",
    teacher: "Mr. John Doe",
    link: "/view-class/1",
  },
  {
    id: 2,
    title: "Understand Questions",
    subTopic: "Critical Thinking",
    teacher: "Ms. Jane Smith",
    link: "/view-class/2",
  },
];

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route
          path="/view-class/:id"
          element={<ViewClass classes={EnrolledClasses} />}
        />
        <Route path="/join-class" element={<JoinClass />} />
        <Route path="*" element={<NoPath />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
