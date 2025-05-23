import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://localhost:3000";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isSignIn ? "/signin" : "/signup";
      const payload = isSignIn
        ? { username, password }
        : { email, username, password };

      const { data } = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      localStorage.setItem("auth-token", data.token);
      // alert(data.message || "Success");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-black via-gray-900 to-black">
      {/* Left Image Section */}
      <div className="md:w-1/2 w-full  md:h-auto flex items-center justify-center p-6">
        <img
          src="Welcome_logo.png"
          alt="Welcome"
          className="object-contain max-h-full drop-shadow-2xl"
        />
      </div>

      {/* Right Auth Section */}
        <div className="md:w-1/2 w-full flex flex-col items-center justify-center p-8 text-white">
        {/* Toggle Switch */}
        <div className="relative mb-10 w-64 h-12 bg-gray-700 rounded-full flex items-center justify-between p-1">
            {/* Sliding background */}
            <motion.div
            layout
            className="absolute h-10 w-1/2 bg-green-600 rounded-full shadow-md transition-all duration-300"
            animate={{ x: isSignIn ? 0 : 120 }} // 128px = 1/2 of 256px (w-64)
            />
            {/* Static buttons */}
            <div className="relative z-10 w-full flex">
            <button
                className={`w-1/2 text-sm font-semibold text-center transition-colors ${
                isSignIn ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setIsSignIn(true)}
            >
                SIGN IN
            </button>
            <button
                className={`w-1/2 text-sm font-semibold text-center transition-colors ${
                !isSignIn ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setIsSignIn(false)}
            >
                SIGN UP
            </button>
            </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            {/* Conditionally rendered email input */}
            {!isSignIn && (
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            )}
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-3 rounded-lg shadow-md"
            >
            {isSignIn ? "Sign In" : "Sign Up"}
            </button>
        </form>
        </div>
    </div>
  );
};

export default AuthPage;
