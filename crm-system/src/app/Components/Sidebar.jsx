import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaAddressBook,
  FaFileAlt,
  FaUsers,
  FaDatabase,
  FaBook,
  FaSpinner,
} from "react-icons/fa";
import Image from "next/image";

const Sidebar = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setUserRole(parsedRole?.value); // Set the user role state
  }, []);

  return (
    <aside className="w-64 bg-white text-gray-800 shadow-md h-screen overflow-y-auto">
      <div className="p-6 flex items-center space-x-4">
        <Image src="/assets/img/logo.jpg" alt="logo" width={70} height={70} />

        <h2 className="text-2xl font-extrabold tracking-wide">
          Viawin Project CRM
        </h2>
      </div>
      <nav className="mt-10">
        <ul className="space-y-2">
          {userRole === "Admin" && (
            <>
              <li>
                <Link href="/Dashboard" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaHome className="mr-3" />
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contracts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Contracts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contacts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaAddressBook className="mr-3" />
                    Contacts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Users" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaUsers className="mr-3" />
                    Users
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Partner" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Partner OverView
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Task" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Task Management
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/ClientApp" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Client App
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/CollectionData" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaDatabase className="mr-3" />
                    Collection Data
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Courses" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaBook className="mr-3" />
                    Courses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Progress" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaSpinner className="mr-3" />
                    Courses Progress
                  </a>
                </Link>
              </li>
            </>
          )}

          {userRole === "Advisor" && (
            <>
              <li>
                <Link href="/Users" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaUsers className="mr-3" />
                    Users
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Dashboard" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaHome className="mr-3" />
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contracts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Contracts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contacts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaAddressBook className="mr-3" />
                    Contacts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Courses" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaBook className="mr-3" />
                    Courses
                  </a>
                </Link>
              </li>
            </>
          )}

          {userRole === "Team Leader" && (
            <>
              <li>
                <Link href="/Users" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaUsers className="mr-3" />
                    Users
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Dashboard" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaHome className="mr-3" />
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contracts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaFileAlt className="mr-3" />
                    Contracts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Contacts" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaAddressBook className="mr-3" />
                    Contacts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/Courses" legacyBehavior>
                  <a className="flex items-center py-2 px-6 text-gray-800 hover:bg-gray-200 rounded transition duration-200 font-semibold">
                    <FaBook className="mr-3" />
                    Courses
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
