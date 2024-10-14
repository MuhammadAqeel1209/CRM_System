'use client'
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [newUser, setNewUser] = useState({
    role: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    position: "",
    location: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users"); 
        if (response.data.success && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.post("/api/users", newUser);
      if (response.data.success && response.data.data) {
        setUsers([...users, response.data.data]);
        setNewUser({
          role: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          dateOfBirth: "",
          position: "",
          location: "",
        });
        setShowForm(false); 
      } else {
        console.error("Unexpected API response on POST:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewUser({
      role: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      position: "",
      location: "",
    });
    setError(null); // Reset error state
  };

  // Delete User Function
  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);
    setError(null); 

    axios
      .delete(`/api/users/${id}`)
      .then((res) => {
        setUsers(users.filter((user) => user._id !== id));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to delete user:", err.response.data.error);
        setError("Failed to delete user. Please try again.");
      });
  };

  // Edit User Function
  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditUser({ ...user }); // Ensure you create a new object
    setError(null); // Reset error state
  };

  // Update User Function
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    axios
      .put(`/api/users/${editUser._id}`, editUser)
      .then((res) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? res.data.data : user
          )
        );
        setLoading(false);
        setIsEditing(false);
        setEditUser(null);
      })
      .catch((err) => {
        console.error("Failed to update user:", err.response.data.error);
        setLoading(false);
      });
  };

  // Handle change in edit form fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add User
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              {/* Close Button */}
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">New User</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Role</label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Advisor">Advisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newUser.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={newUser.position}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newUser.location}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            </div>
          )}

          {isEditing && (
            <div className="bg-white p-6 shadow rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Role</label>
                    <select
                      name="role"
                      value={editUser.role}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Advisor">Advisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editUser.firstName}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editUser.lastName}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editUser.phoneNumber}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser.email}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editUser.dateOfBirth}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={editUser.position}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editUser.location}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {loading ? "Updating..." : "Update User"}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 border-b">Role</th>
                  <th className="py-2 border-b">First Name</th>
                  <th className="py-2 border-b">Last Name</th>
                  <th className="py-2 border-b">Phone Number</th>
                  <th className="py-2 border-b">Email</th>
                  <th className="py-2 border-b">Date of Birth</th>
                  <th className="py-2 border-b">Position</th>
                  <th className="py-2 border-b">Location</th>
                  <th className="py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 border-b">{user.role}</td>
                    <td className="py-2 border-b">{user.firstName}</td>
                    <td className="py-2 border-b">{user.lastName}</td>
                    <td className="py-2 border-b">{user.phoneNumber}</td>
                    <td className="py-2 border-b">{user.email}</td>
                    <td className="py-2 border-b">{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                    <td className="py-2 border-b">{user.position}</td>
                    <td className="py-2 border-b">{user.location}</td>
                    <td className="py-2 border-b">
                      <button onClick={() => handleEditUser(user)}>
                        <FaEdit className="text-blue-500" />
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        <FaTrash className="text-red-500 ml-2" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;
