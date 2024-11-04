import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword"
import Chatbot from "./pages/Chatbot"
import Register from "./pages/Register"
import LoginTest from "./pages/LoginTest"
import Profile from "./pages/ProfilePage"
import ForgotPasswordTest from "./pages/ForgotPasswordTest"
import MainWrapper from "../src/layout/MainWrapper";
import PrivateRoute from "./layout/PrivateRoute"
import Logout from "./pages/Logout"

// function Logout() {
//   localStorage.clear()
//   return <Navigate to="/login" />
// }

function SignUpAndLogOut() {
  localStorage.clear()
  return <SignUp />
}

function App() {
  return (
    <>
      <BrowserRouter>
        <MainWrapper>
        <Routes>
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/login" 
            element={
              <LoginTest />
            }
          />
          <Route 
            path="/logout" 
            element={
              <Logout />
            }
          />
          <Route 
            path="/signup" 
            element={
              <SignUpAndLogOut />
            }
          />
          <Route
            path="/forgot"
            element={
              <ForgotPassword />
            }

          />
          <Route 
            path="*" 
            element={
              <NotFound />
            }
          />
          <Route 
            path="/chatbot" 
            element={
              <Chatbot />
            }
          />
          <Route 
            path="/register" 
            element={
              <Register />
            }
          />
          <Route 
            path="/profile" 
            element={
              <Profile />
            }
          />
          <Route 
            path="/forgottest" 
            element={
              <ForgotPasswordTest />
            }
          />
        </Routes>
        </MainWrapper>
      </BrowserRouter>
    </>
  )
}

export default App
