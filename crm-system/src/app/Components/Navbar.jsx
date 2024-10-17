import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    router.push("/")
    setIsLoggedIn(false);
  };

  return (
    <header className="flex justify-end items-center bg-white shadow p-4">
      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-600 cursor-pointer" />
        <FaUserCircle className="text-gray-600 cursor-pointer" />
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
