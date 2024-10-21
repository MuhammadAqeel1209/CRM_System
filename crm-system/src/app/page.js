'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

// Set and get with expiration helper functions
function setItemWithExpiry(key, value, expiryInMinutes) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + expiryInMinutes * 60 * 1000, // Convert minutes to milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  console.log(item.value);
  return item.value;
}

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is already logged in with valid expiry
  useEffect(() => {
    const userRole = getItemWithExpiry('userRole');
    if (userRole) {
      router.push("/Dashboard");
    }
  }, [router]);

  // Handle login action
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await axios.post(`/api/login`, { email, password });

      if (response.data.success) {
        const user = response.data.data;
        setItemWithExpiry('userRole', user.role, 60); // Expire in 60 minutes
        setItemWithExpiry('userId', user._id, 60);   // Expire in 60 minutes
        router.push("/Dashboard");
      } else {
        setError(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while logging in. Please try again.");
      console.error("Error logging in:", error);
    }
  };

  // Handle sign up redirection
  const handleSignUp = () => {
    router.push("/SignUp"); // Navigate to the sign-up page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl transform transition duration-500 hover:scale-105">
        <div className="p-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Welcome Back
          </h2>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button
              onClick={handleSignUp}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}