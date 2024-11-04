import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Login.css";  // Updated CSS file

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post("/api/token/", { username: email, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <title>Login Page</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
                rel="stylesheet"
            />
            <div className="loginform-main-container">
                <div className="loginform-box-container">
                    <div className="loginform-left-box">
                        <form onSubmit={handleSubmit}>
                            <div className="loginform-username-wrapper">
                                <label className="loginform-username-label">Email</label>
                                <input
                                    className="loginform-username-input"
                                    type="text"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="loginform-password-wrapper">
                                <label className="loginform-password-label">Password</label>
                                <input
                                    className="loginform-password-input"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="loginform-forgot-password">
                                <a className="loginform-forgot-password-link" href="/forgot">
                                    Forgot password?
                                </a>
                            </div>
                            <button type="submit" className="loginform-login-button">
                                {loading ? "Loading..." : "Login"}
                            </button>
                        </form>
                        <div className="loginform-sign-up">
                            <a>Don't have an account? </a>
                            <a className="loginform-sign-up-link" href="/register">
                                Sign up
                            </a>
                        </div>
                    </div>
                    <div className="loginform-right-box">
                        Placeholder image
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
