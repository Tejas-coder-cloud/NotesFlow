import { useState } from "react";
import "../styles/Login.css";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://notesflow-backend-frui.onrender.com/api/auth/login",
        {
          email,
          password
        }
      );
      localStorage.setItem(
        "token",
        response.data.token
      );
      navigate("/dashboard");
      console.log(response.data);
      toast.success("Login Successful");
    } catch (error) {

      console.log(error.response.data);

      alert(error.response.data.message);
    }
  };
  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
          <div className="password-container">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {
                showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
              }
            </span>
          </div>
          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="register-link">
          Don't have an account?
          <br />
          <Link to="/register">
            Register Here
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
export default Login;