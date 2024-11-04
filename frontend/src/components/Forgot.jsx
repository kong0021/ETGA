function Forgot(){
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
                        Forgot Password
                    </div>
                </div>
                <div className="input-box">
                    <div className="email-box">
                        <div className="email-wrapper">
                            <label className="email-label">Email</label>
                            <input
                            className="email-input"
                            type="text"
                            placeholder="Enter email"
                            required=""
                            />
                        </div>
                    </div>
                    <button type="submit" className="forgotpassword-button">
                        Forgot Password
                    </button>
                </div>
            </div>
        </div>
    </>)
}

export default Forgot