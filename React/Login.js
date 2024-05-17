import React, { useEffect, useState } from 'react';
import api from "./api";
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Styles/Login.css';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [passwordMismatchError, setPasswordMismatchError] = useState(""); 
  const [loginError, setLoginError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const [isShaking, setIsShaking] = useState(false); 

  const handleRegisterInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/users/me/profile");
      if (response.data && response.data.length > 0) {
        // If the user has a profile, redirect to products&services
        navigate('/productsservices');
      } else {
        // If the user doesn't have a profile, stay on the dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Check if username and password are not empty
      if (!registerFormData.username || !registerFormData.password) {
        console.error("Username and password are required");
        setIsShaking(true); // Trigger shake animation
        setTimeout(() => setIsShaking(false), 500); // Turn off shake animation after 0.5s
        return; // Exit early if validation fails
      }
      await api.post("/users/", registerFormData);
      setIsLoginFormVisible(true);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
        // Convert the login form data to x-www-form-urlencoded format
        const formData = new URLSearchParams();
        formData.append('username', loginFormData.username);
        formData.append('password', loginFormData.password);
        const response = await api.post("/token/", formData);
        if (response.data.access_token) {
          // If the login is successful, store the token in local storage
          localStorage.setItem("token", response.data.access_token);
          // Set the isAuthenticated state to true
          setIsAuthenticated(true);
        } else {
          // If the login is not successful, display an error message
          setLoginError("Invalid username/password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        setLoginError("Invalid username/password");
        
    }
  };

  const handleSwitchForm = () => {
    setIsLoginFormVisible((prevIsLoginFormVisible) => !prevIsLoginFormVisible);
    setPasswordMismatchError("");
    setLoginError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      backgroundImage: "url('LoginBackground.jpg')", 
      backgroundSize: "cover", 
      backgroundPosition: "center" 
      }}>
      <div style={{ 
        textAlign: "center", 
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        padding: "2rem", 
        borderRadius: "10px" 
        }}>
        {isLoginFormVisible ? (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLoginFormSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="username">Username</label>
                <br />
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={handleLoginInputChange}
                  value={loginFormData.username}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">Password</label>
                <br />
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={handleLoginInputChange}
                    value={loginFormData.password}
                  />
                  <button type="button" onClick={togglePasswordVisibility} style={{ 
                      position: "absolute", 
                      right: "-10px", 
                      top: "15px", 
                      transform: "translateY(-50%)", 
                      background: "none", 
                      color: "black", 
                      cursor: "pointer",
                      zIndex: "1" // Ensure the button appears on top
                  }}>
                      {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} 
                  </button>
                </div>
              </div>
              {loginError && <div style={{ color: "red" }}>{loginError}</div>} {/* Display login error message */}
              <button type="submit">Login</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <form onSubmit={handleRegisterFormSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="username">Username</label>
                <br />
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={handleRegisterInputChange}
                  value={registerFormData.username}
                  className={isShaking ? "shake" : ""}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">Password</label>
                <br />
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={handleRegisterInputChange}
                    value={registerFormData.password}
                    className={isShaking ? "shake" : ""}
                  />
                  <button type="button" onClick={togglePasswordVisibility} style={{ 
                      position: "absolute", 
                      right: "-10px", 
                      top: "15px", 
                      transform: "translateY(-50%)", 
                      background: "none", 
                      color: "black", 
                      cursor: "pointer",
                      zIndex: "1"
                  }}>
                      {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} 
                  </button>
                </div>
              </div>
              {passwordMismatchError && <div style={{ color: "red" }}>{passwordMismatchError}</div>}
              <button type="submit">Register</button>
            </form>
          </div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSwitchForm} style={{ 
            padding: "0.5rem 1rem", 
            fontSize: "1rem", 
            cursor: "pointer", 
            backgroundColor: "#007bff", 
            color: "#fff", 
            border: "none", 
            borderRadius: "5px" 
            }}>
            {isLoginFormVisible ? "No Account?" : "Already Registered?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
