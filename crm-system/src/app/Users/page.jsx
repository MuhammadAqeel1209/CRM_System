'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Fetch users from API (replace with your API endpoint)
//     axios.get('/api/users')
//       .then(response => setUsers(response.data))
//       .catch(error => console.error(error));
//   }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              <FaPlus className="mr-2" />
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.role}</td>
                    <td className="py-2 px-4 border-b">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
