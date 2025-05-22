import { useState } from "react";
import { motion } from "framer-motion";

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

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
        <form className="w-full max-w-sm space-y-6">
            {/* Conditionally rendered email input */}
            {!isSignIn && (
            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            )}
            <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
            type="password"
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
