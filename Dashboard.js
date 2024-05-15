import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import api from './api';
import './Styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [objectives, setObjectives] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/users/me/");
        const username = response.data.username;
        setUserName(username);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, navigate]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // Check if the user already has a profile
      const existingProfileResponse = await api.get("/users/me/profile");
      if (existingProfileResponse.data.length > 0) {
        // If a profile already exists, display an error message or take appropriate action
        console.error("User already has a profile");
        setLoading(false);
        return;
      }
      // Create a new client profile
      await api.post("/users/me/profile", { age, weight, height, objectives });
      setLoading(false);
      // Redirect to products&services page
      navigate('/productsservices');
    } catch (error) {
      console.error("Error creating client profile:", error);
      setLoading(false);
      // Handle error appropriately (e.g., display an error message)
    }
  };

  return (
    <div className="dashboard-container">
      <h4>Hello, {userName}</h4>
      <form onSubmit={handleProfileSubmit}>
        <div>
          <label htmlFor="age">Age:</label>
          <input 
            type="number" 
            id="age" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
            placeholder="Enter your age" 
          />
        </div>
        <div>
          <label htmlFor="weight">Weight (kg):</label>
          <input 
            type="number" 
            id="weight" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            required 
            placeholder="Enter your weight in kg" 
          />
        </div>
        <div>
          <label htmlFor="height">Height (cm):</label>
          <input 
            type="number" 
            id="height" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            required 
            placeholder="Enter your height in cm" 
          />
        </div>
        <div>
          <label htmlFor="objectives">Objectives:</label>
          <select 
            id="objectives" 
            value={objectives} 
            onChange={(e) => setObjectives(e.target.value)} 
            required
          >
            <option value="">Select Objective</option>
            <option value="Weight loss">Weight Loss</option>
            <option value="Maintain">Maintain</option>
            <option value="Weight Gain">Weight Gain</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Save Profile'}</button>
      </form>
    </div>
  );
};

export default Dashboard;
