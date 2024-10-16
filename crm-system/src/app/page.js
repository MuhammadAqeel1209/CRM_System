'use client'
import React, { useState } from "react";
import Dashboard from "@/app/Components/Dashborad";
import axios from "axios";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 

  // Simulate login action by fetching user data from API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await axios.get(`/api/users`);
      
      if (response.data.success && response.data.data) {
        const user = response.data.data;
        console.log(user)

        if (user.password === password && user.email === email) { 
          console.log("Login successful:", user);
          setIsLoggedIn(true);
          // Redirect to the dashboard
          router.push('/dashboard');
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("User does not exist.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while logging in. Please try again.");
      console.error("Error logging in:", error);
    }  };

  return (
    <Dashboard/>
    // <div>
    //   {isLoggedIn ? (
    //     <Dashboard />
    //   ) : (
    //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
    //       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
    //         <div className="p-8">
    //           <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
    //             Welcome Back
    //           </h2>

    //           {error && (
    //             <div className="text-red-500 text-sm mb-4 text-center">
    //               {error}
    //             </div>
    //           )}

    //           <form onSubmit={handleLogin} className="space-y-6">
    //             <div className="relative">
    //               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    //                 Email Address
    //               </label>
    //               <div className="mt-1 relative rounded-md shadow-sm">
    //                 <input
    //                   type="email"
    //                   id="email"
    //                   value={email}
    //                   onChange={(e) => setEmail(e.target.value)}
    //                   required
    //                   className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //                   placeholder="you@example.com"
    //                 />
    //               </div>
    //             </div>

    //             <div className="relative">
    //               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    //                 Password
    //               </label>
    //               <div className="mt-1 relative rounded-md shadow-sm">
    //                 <input
    //                   type="password"
    //                   id="password"
    //                   value={password}
    //                   onChange={(e) => setPassword(e.target.value)}
    //                   required
    //                   className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //                   placeholder="••••••••"
    //                 />
    //               </div>
    //             </div>

    //             <div>
    //               <button
    //                 type="submit"
    //                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //               >
    //                 Log in
    //               </button>
    //             </div>
    //           </form>

    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}
