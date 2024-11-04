import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";  // Updated CSS file

function SignUpForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            await api.post("/api/user/register/", {
                username: email,
                first_name: firstName,
                last_name: lastName,
                email: email,
                password,
            });
            navigate("/login");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <title>Sign Up Page</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
                rel="stylesheet"
            />
            <div className="signupform-main-container">
                <div className="signupform-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="signupform-title-box">
                            <div className="signupform-title">
                                Create Account
                            </div>
                        </div>
                        <div className="signupform-login">
                            <a>Already have an account? </a>
                            <a className="signupform-login-link" href="/login">
                                Login
                            </a>
                        </div>
                        <div className="signupform-input-box">
                            <div className="signupform-name-box">
                                <div className="signupform-firstname-wrapper">
                                    <label className="signupform-firstname-label">First name</label>
                                    <input
                                        className="signupform-firstname-input"
                                        type="text"
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="signupform-lastname-wrapper">
                                    <label className="signupform-lastname-label">Last name</label>
                                    <input
                                        className="signupform-lastname-input"
                                        type="text"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="signupform-email-box">
                                <div className="signupform-email-wrapper">
                                    <label className="signupform-email-label">Email</label>
                                    <input
                                        className="signupform-email-input"
                                        type="text"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="signupform-password-box">
                                <div className="signupform-password-wrapper">
                                    <label className="signupform-password-label">Password</label>
                                    <input
                                        className="signupform-password-input"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="signupform-signup-button">
                                {loading ? "Loading..." : "Sign Up"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUpForm;
