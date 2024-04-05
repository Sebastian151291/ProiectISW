import React, { useEffect, useState } from 'react';
import api from "./api";
import { useAuth } from './AuthContext'; // import the useAuth hook
import { useNavigate } from 'react-router-dom'; // import the useNavigate hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // get the isAuthenticated and setIsAuthenticated functions from the AuthContext
  const navigate = useNavigate(); // get the navigate function from react-router-dom
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  });

  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [passwordMismatchError, setPasswordMismatchError] = useState(""); // State for password mismatch error
  const [loginError, setLoginError] = useState(""); // State for login error
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [isShaking, setIsShaking] = useState(false); // State for shake animation

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

  useEffect(() => {
    // Check if the user is authenticated and only redirect if not on the login page
    if (isAuthenticated && !window.location.pathname.includes('/login')) {
      // Fetch user information when the component mounts
      fetchUserInfo();
    }
  }, [isAuthenticated]);
  
  const fetchUserInfo = async () => {
    try {
      const response = await api.get(`/clients/`); // Replace userId with the actual user ID
      if (response.data) {
        // Redirect to ProductsServices page if client profile exists
        navigate('/dashboard');
      } else {
        // Redirect to dashboard if no client profile exists
        navigate('/products&services');
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Check if username and password are not empty
      if (!registerFormData.username || !registerFormData.password) {
        // Display error message or prevent form submission
        console.error("Username and password are required");
        setIsShaking(true); // Trigger shake animation
        setTimeout(() => setIsShaking(false), 500); // Turn off shake animation after 0.5s
        return; // Exit early if validation fails
      }
      await api.post("/register/", registerFormData);
      setIsLoginFormVisible(true);
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/login/", loginFormData);
      if (response.data) {
        // Store the access token in local storage
        localStorage.setItem('accessToken', response.data.accessToken);
        // Update the isAuthenticated state
        setIsAuthenticated(true);
        // Fetch user information to determine redirection
        fetchUserInfo();
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Set login error message
      setLoginError("Incorrect username or password");
    }
  };

  const handleSwitchForm = () => {
    setIsLoginFormVisible((prevIsLoginFormVisible) => !prevIsLoginFormVisible);
    // Reset error messages when switching forms
    setPasswordMismatchError("");
    setLoginError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundImage: "url('123.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div style={{ textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "2rem", borderRadius: "10px" }}>
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
                    type={showPassword ? "text" : "password"} // Toggle between text and password type
                    id="password"
                    name="password"
                    onChange={handleLoginInputChange}
                    value={loginFormData.password}
                  />
                  <button type="button" onClick={togglePasswordVisibility} style={{ position: "absolute", right: "2px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }}>
                    {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} {/* Eye icon */}
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
                    type={showPassword ? "text" : "password"} // Toggle between text and password type
                    id="password"
                    name="password"
                    onChange={handleRegisterInputChange}
                    value={registerFormData.password}
                    className={isShaking ? "shake" : ""}
                  />
                  <button type="button" onClick={() => togglePasswordVisibility("password")} style={{ position: "absolute", right: "2px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }}>
                    {showPassword.password ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />} {/* Eye icon */}
                  </button>
                </div>
              </div>
              {passwordMismatchError && <div style={{ color: "red" }}>{passwordMismatchError}</div>} {/* Display password mismatch error message */}
              <button type="submit">Register</button>
            </form>
          </div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSwitchForm} style={{ padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
            {isLoginFormVisible ? "No Account?" : "Already Registered?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
