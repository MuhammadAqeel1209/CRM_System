import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaAddressBook,
  FaFileAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 text-2xl font-bold">CRM System</div>
      <nav className="mt-10">
        <Link href="/" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaHome className="mr-3" />
            Dashboard
          </a>
        </Link>
        <Link href="/Contracts" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-3" />
            Contracts
          </a>
        </Link>
        <Link href="/Contacts" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaAddressBook className="mr-3" />
            Contacts
          </a>
        </Link>
        <Link href="/Users" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaUsers className="mr-3" />
            Users
          </a>
        </Link>
        <Link href="/Partner" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-3" />
            Partner Overview
          </a>
        </Link>
        <Link href="/Task" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-3" />
            Task
          </a>
        </Link>
        <Link href="/ClientApp" legacyBehavior>
          <a className="flex items-center py-2 px-6 text-gray-700 hover:bg-gray-200">
            <FaFileAlt className="mr-3" />
            Client App
          </a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
