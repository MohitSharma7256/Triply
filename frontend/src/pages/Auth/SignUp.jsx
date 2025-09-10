import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import LOGO from "../../../public/images/Triply.png"

const Signup = () => {
  const navigate = useNavigate();

  // Proper state variable names
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError("Please fill in all the fields");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName,
        email,
        password,
      });

      if (response.data && response.data.success) {
        // Store the token with the correct key name
        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
        }

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="container h-full flex items-center justify-center px-5 md:px-20 mx-auto">

        {/* Left Image Section */}
        <div
          className="hidden md:flex w-1/2 h-[90vh] bg-cover bg-center rounded-lg p-10"
          style={{
            backgroundImage: `url('/images/bg-signup.jpg')`, // Use public folder correctly
          }}
        >
          <div className="text-gray-900 z-10">
            <h4 className="text-4xl font-bold mb-4">Join Us Today</h4>
            <p className="text-lg">
              Start recording your travel stories and keep them forever.
            </p>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="w-full md:w-1/2 h-[85vh] bg-white rounded-lg md:rounded-l-none p-8 md:p-16 shadow-lg shadow-cyan-200/30">
          <div className="flex items-center justify-center">
            <img
              src={LOGO}
              alt='Travel Story'
              className='h-12 w-auto object-contain cursor-pointer'
              onClick={() => navigate("/")}
            />
          </div>
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-7">Create Account</h4>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full mt-4 bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition"
            >
              SIGN UP
            </button>

            <p className="text-xs text-slate-500 text-center my-4">
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300 transition"
            >
              Go to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;