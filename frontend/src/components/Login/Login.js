import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const LoginComponent = () => {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3005/api/students");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorField, setError] = useState("");
  const [userData, setUserData] = useState([]);
  const [adminStatus, setAdminStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email or password cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email-id");
      return;
    } else {
      Login(email, password);
    }
  };
  const Login = (email, password) => {
    setError("");
    const user = userData.find((user) => user.email === email.toLowerCase());

    if (!user) {
      setError("Unregistered Email Id");
      return;
    } else {
      if (user.password === password) {
        if (user.email === "admin@example.com") {
          console.log(user.email);
          localStorage.setItem("UserType", "Admin");
          console.log(localStorage.getItem("UserType"));
        } else {
        }
        const queryString = location.search; // returns the query string from the current url
        let strReturnUrl = new URLSearchParams(queryString).get("returnUrl");
        if (strReturnUrl === null) {
          strReturnUrl = "/dashboard";
        }
        // In real-time apps, we will get the token from the server
        // JWT token is the popular token generation library
        let token = "ASJDFJF87ADF8745LK4598SAD7FAJSDF45JSDLFKAS";
        sessionStorage.setItem("user-token", token);
        navigate(strReturnUrl);
        // navigate("/dashboard", { state: { prop1: adminStatus } });
      } else {
        setError("Incorrect Password");
      }
    }
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="form-container log-in-container">
          <form className="form">
            <h1 style={{ color: "#00796b" }}>Login</h1>
            <div className="formgroup">
              <input
                className="input"
                type="email"
                placeholder="Enter your email-id"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="formgroup">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              <p className="showPassword" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <i class="bi bi-eye-slash"></i>
                ) : (
                  <i class="bi bi-eye"></i>
                )}
              </p>
            </div>
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            <Link to="/ForgotPassword" className="mb-3 mt-3">
              Forgot Password
            </Link>
            <label>Not a Member? SignUp</label>
            {errorField && <div className="error-message">{errorField}</div>}
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>HouseKeeper Scheduling system</h1>
              <p style={{ color: "#ffc107" }}>
                This is the place where you can schedule your comfortable time
                for cleaning purposes for HouseKeeper.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
