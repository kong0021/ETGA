import React, { useState } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import apiInstance from "../utils/axios";
import { useAuthStore } from "../store/auth";
import { login } from "../utils/auth";
import "../styles/Login.css";  // Ensure your CSS file is included

function Login() {
    const [bioData, setBioData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setBioData({
            email: "",
            password: "",
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(bioData.email, bioData.password);
        if (error) {
            alert(JSON.stringify(error));
            resetForm();
        } else {
            // localStorage.setItem(ACCESS_TOKEN, res.data.access);
            // localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        }

        // Reset isLoading to false when the operation is complete
        setIsLoading(false);
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
            <section className="loginform-main-container">
                <div className="loginform-box-container">
                    <div className="loginform-left-box">
                        <form className="needs-validation" noValidate="" onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="loginform-email-wrapper">
                                <label htmlFor="email" className="loginform-email-label">Email Address</label>
                                <input
                                    type="email"
                                    onChange={handleBioDataChange}
                                    value={bioData.email}
                                    id="email"
                                    className="loginform-email-input"
                                    name="email"
                                    placeholder="johndoe@gmail.com"
                                    required=""
                                />

                            </div>
                            {/* Password */}
                            <div className="loginform-password-wrapper">
                                <label htmlFor="password" className="loginform-password-label">Password</label>
                                <input
                                    type="password"
                                    onChange={handleBioDataChange}
                                    value={bioData.password}
                                    id="password"
                                    className="loginform-password-input"
                                    name="password"
                                    placeholder="**************"
                                    required=""
                                />
                            </div>
                            {/* Checkbox */}
                            <div className="d-lg-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <Link to="/forgot-password/">Forgot your password?</Link>
                                </div>
                            </div>
                            <div>
                                <div className="d-grid">
                                    <button className="signupform-signup-button" type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <span className="mr-2">Processing...</span>
                                                <i className="fas fa-spinner fa-spin" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">Sign In </span>
                                                <i className="fas fa-sign-in-alt" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="loginform-sign-up">
                                    <a>Don't have an account? </a>
                                    <a className="loginform-sign-up-link" href="/register">
                                        Sign up
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="loginform-right-box">
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
