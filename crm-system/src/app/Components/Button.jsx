"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Button = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    router.push("/");
    setIsLoggedIn(false);
  };
  return (
    <div>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Button;
