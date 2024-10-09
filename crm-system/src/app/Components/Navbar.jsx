import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="flex justify-end items-center bg-white shadow p-4">
      <div className="flex items-center space-x-4">
        <FaBell className="text-gray-600 cursor-pointer" />
        <FaUserCircle className="text-gray-600 cursor-pointer" />
      </div>
    </header>
  );
};

export default Navbar;
