import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import apiInstance from "../utils/axios";
import { useAuthStore } from "../store/auth";
import { register } from "../utils/auth";
import "../styles/SignUp.css";  // Ensure your CSS file is included


function Register() {
    const [bioData, setBioData] = useState({ full_name: "", email: "", password: "", password2: "" });
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
            full_name: "",
            email: "",
            password: "",
            password2: "",
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await register(bioData.full_name, bioData.email, bioData.password, bioData.password2);
        if (error) {
            alert(JSON.stringify(error));
            resetForm();
        } else {
            navigate("/");
        }

        // Reset isLoading to false when the operation is complete
        setIsLoading(false);
    };

    return (
        <>
            <title>Sign Up Page</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
            <div className="signupform-main-container">
                <div className="signupform-form-container">
                    <div className="signupform-title-box">
                        <div className="signupform-title">
                            Create Account
                        </div>
                    </div>
                    <div className="signupform-login">
                        <span>Already have an account? </span>
                        <a className="signupform-login-link" href="/login">
                            Login
                        </a>
                    </div>
                    <form className="needs-validation" onSubmit={handleRegister}>
                        {/* Full Name */}
                        <div className="signupform-input-box">
                            <div className="signupform-name-box">
                                <div className="signupform-fullname-wrapper">
                                    <label htmlFor="full_name" className="signupform-fullname-label">Full Name</label>
                                    <input
                                        type="text"
                                        onChange={handleBioDataChange}
                                        value={bioData.full_name}
                                        id="full_name"
                                        className="signupform-fullname-input"
                                        name="full_name"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Email Address */}
                            <div className="signupform-email-box">
                                <div className="signupform-email-wrapper">
                                    <label htmlFor="email" className="signupform-email-label">Email Address</label>
                                    <input
                                        type="email"
                                        onChange={handleBioDataChange}
                                        value={bioData.email}
                                        id="email"
                                        className="signupform-email-input"
                                        name="email"
                                        placeholder="johndoe@gmail.com"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Password */}
                            <div className="signupform-password-box">
                                <div className="signupform-password-wrapper">
                                    <label htmlFor="password" className="signupform-password-label">Password</label>
                                    <input
                                        type="password"
                                        onChange={handleBioDataChange}
                                        value={bioData.password}
                                        id="password"
                                        className="signupform-password-input"
                                        name="password"
                                        placeholder="**************"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Confirm Password */}
                            <div className="signupform-confirmpassword-box">
                                <div className="signupform-password-wrapper">
                                    <label htmlFor="password2" className="signupform-password-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        onChange={handleBioDataChange}
                                        value={bioData.password2}
                                        id="password2"
                                        className="signupform-password-input"
                                        name="password2"
                                        placeholder="**************"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Submit Button */}
                            <div className="d-grid">
                                <button className="signupform-signup-button" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="mr-2">Processing...</span>
                                    ) : (
                                        <span className="mr-2">Sign Up</span>
                                    )}
                                    {isLoading && <i className="fas fa-spinner fa-spin" />}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;