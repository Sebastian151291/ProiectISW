import React, { useState } from "react";
import api from "./api";

const Login = () => {
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    password: ""
  });

  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  });

  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

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

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/register/", registerFormData);
      // Optionally, you can redirect the user after successful registration
      // window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/login/", loginFormData);
      // Optionally, you can redirect the user after successful login
      // window.location.href = "/dashboard"; // Redirect to dashboard
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSwitchForm = () => {
    setIsLoginFormVisible((prevIsLoginFormVisible) => !prevIsLoginFormVisible);
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
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleLoginInputChange}
                  value={loginFormData.password}
                />
              </div>
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
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">Password</label>
                <br />
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleRegisterInputChange}
                  value={registerFormData.password}
                />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSwitchForm} style={{ padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
            {isLoginFormVisible ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
