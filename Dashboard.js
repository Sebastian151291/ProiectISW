import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // import the useAuth hook
import api from './api';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [objectives, setObjectives] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // State to store the user's name

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Fetch user information when the component mounts
      fetchUserInfo();
    }
  }, [isAuthenticated, navigate]);

  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // Handle case where access token is not available
        console.error("Access token not found");
        return;
      }
      // Decode the JWT token to extract user ID
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId; // Assuming your token includes a field named userId
      const response = await api.get(`/clients/${userId}`);
      if (response.data) {
        // If the user exists in the clients table, redirect to products&services
        navigate('/products&services');
      } else {
        // If the user does not exist in the clients table, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };
  

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      // Check if the user already has a profile
      const existingProfileResponse = await api.get("/clients/");
      if (existingProfileResponse.data.length > 0) {
        // If a profile already exists, display an error message or take appropriate action
        console.error("User already has a profile");
        setLoading(false);
        return;
      }
      // Create a new client profile
      await api.post("/clients/", { age, weight, height, objectives });
      setLoading(false);
      // Redirect to products&services page
      navigate('/products&services');
    } catch (error) {
      console.error("Error creating client profile:", error);
      setLoading(false);
      // Handle error appropriately (e.g., display an error message)
    }
  };

  return (
    <div>
      <h1>Hello, {userName}</h1>
      <form onSubmit={handleProfileSubmit}>
        <div>
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="weight">Weight (kg):</label>
          <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="height">Height (cm):</label>
          <input type="number" id="height" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="objectives">Objectives:</label>
          <select id="objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} required>
            <option value="">Select Objective</option>
            <option value="Weight Loss">Weight Loss</option>
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
