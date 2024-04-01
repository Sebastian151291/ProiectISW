import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Render Login component for /login route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Render Dashboard component for /dashboard route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
