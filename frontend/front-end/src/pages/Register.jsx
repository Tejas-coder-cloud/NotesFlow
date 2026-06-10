import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Register.css";
import { Link } from "react-router-dom";
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );
            console.log(response.data);
            alert("User registered successfully");
        } catch (error) {
            console.log(error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Backend Server Not Running");
            }
        }
    };
    return (
        <div className="register-page">
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">
                    NotesFlow
                </h1>
                <p>
                    Create your account
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        className="register-input"
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                    <input
                        className="register-input"
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                    <div className="password-container">
                        <input
                            className="register-input"
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
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        className="register-btn"
                        type="submit"
                    >
                        Register
                    </button>
                </form>
                <div className="login-link">
                    Already have an account?
                    <br />
                    <Link to="/">
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
}
export default Register;