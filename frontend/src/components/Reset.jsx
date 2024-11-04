function Reset(){
    return(<>
        <title>Forgot Password Page</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
        />
        <div className="main-container">
            <div className="form-container">
                <div className="title-box">
                    <div className="title">
                        Reset Password
                    </div>
                </div>
                <div className="input-box">
                    <div className="email-box">
                        <div className="email-wrapper">
                            <label className="email-label">Password</label>
                            <input
                            className="password-input"
                            type="password"
                            placeholder="Enter new password"
                            required=""
                            />
                        </div>
                        <div className="email-wrapper">
                            <label className="email-label">Confirm Password</label>
                            <input
                            className="password-input"
                            type="password"
                            placeholder="Confirm new password"
                            required=""
                            />
                        </div>
                    </div>
                    <button type="submit" className="forgotpassword-button">
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    </>)
}

export default Reset