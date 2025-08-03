import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import LOGO from "../../../public/images/Triply.png"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError(null); // Clear previous error

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        // Store token with the correct key name
        localStorage.setItem("accessToken", response.data.accessToken);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="container h-full flex items-center justify-center px-5 md:px-20 mx-auto">

        {/* Left side with background image */}
        <div
          className="hidden md:flex w-1/2 h-[90vh] bg-cover bg-center rounded-lg p-10"
          style={{
            backgroundImage: `url('/images/bg-login.jpg')`,
          }}
        >
          <div className="text-white z-10">
            <h4 className="text-4xl font-bold mb-4">Capture Your Journeys</h4>
            <p className="text-lg">
              Record your travel experiences and memories in your personal journal.
            </p>
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 h-[75vh] bg-white rounded-lg md:rounded-l-none p-8 md:p-16 shadow-lg shadow-cyan-200/30">
        <div className="flex items-center justify-center">
          <img
                  src={LOGO}
                  alt='Travel Story'
                  className='h-12 w-auto object-contain cursor-pointer'
                  onClick={() => navigate("/")}
                />
        </div>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <PasswordInput value={password}  onChange={(e) => setPassword(e.target.value)} />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full mt-4 bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
            >
              LOGIN
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300 transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;