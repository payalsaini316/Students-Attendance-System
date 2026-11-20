
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        identifier: identifier.trim(),
        password,
        role
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "staff") {
        navigate("/staff-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }

    } catch (err) {
      console.log("Login Error:", err);
      console.log("Server Response:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const changeRole = (newRole) => {
    setRole(newRole);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <img
          src="/images/school-logo.png"
          alt="SD Public School"
          className="school-logo"
        />

        <h2>SWAMI DAYANAND PUBLIC SCHOOL</h2>

        <p className="login-subtitle">
          Student Attendance Management System
        </p>

        <h3>Welcome Back!</h3>
        <p>Please login to your account</p>

        <div className="login-tabs">
          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => changeRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "staff" ? "active" : ""}
            onClick={() => changeRole("staff")}
          >
            Staff
          </button>

          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => changeRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label>
            {role === "student"
              ? "Student ID"
              : role === "staff"
              ? "Staff ID / Email"
              : "Admin Email"}
          </label>

          <input
            type="text"
            placeholder={
              role === "student"
                ? "Enter Student ID"
                : role === "staff"
                ? "Enter Staff ID or Email"
                : "Enter Admin Email"
            }
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          {role !== "admin" && (
            <div className="forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {role !== "admin" && (
          <p className="signup-text">
            New user? <Link to="/signup">Create Account</Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;
