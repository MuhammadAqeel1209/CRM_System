"use client";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    role: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dateOfBirth: "",
    position: "",
    location: "",
    profileImage: "", // Store the image file here
  });

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setUserRole(parsedRole.value);
  }, []);

  // Fetch users on component mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      if (response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error("Unexpected API respons)e structure:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) {
      // Handle the case where no file was selected
      connsole.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file); 
    formData.append("userId",newUser._id)
    try {
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
  
      // Assuming the API responds with the image URL in response.data
      const imageUrl = response.data.imageUrl; // Adjust based on your API response
  
      if (imageUrl) {
        setNewUser({ ...newUser, profileImage: imageUrl });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };
  

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) {
      // Handle the case where no file was selected
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId",editUser._id)
     // 'image' is the key used to upload
  
    try {
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
  
      // Assuming the API responds with the image URL in response.data
      const imageUrl = response.data.imageUrl; // Adjust based on your API response
      console.log(imageUrl)
    
  
      if (imageUrl) {
        setNewUser({ ...editUser, profileImage: imageUrl });
        console.log(editUser)
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    try {
console.log(newUser)
      const user = {
        ...newUser,
      };

      // Send the user data to the server via POST request
      const response = await axios.post("/api/users", user);

      if (response.data.success && response.data.data) {
        // Successfully added user, update the state
        setUsers([...users, response.data.data]);

        // Reset form state
        setNewUser({
          role: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          password: "",
          email: "",
          dateOfBirth: "",
          position: "",
          location: "",
          teamId: "",
        });

        // Hide the form after successful submission
        setShowForm(false);
      } else {
        console.error("Unexpected API response on POST:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please check your input and try again.");
    } finally {
      setLoading(false); // Stop loading state regardless of success or failure
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewUser({
      role: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
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
        console.error(
          "Failed to delete user:",
          err.response?.data?.error || err.message
        );
        setError("Failed to delete user. Please try again.");
      });
  };

  // Edit User Function
  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditUser({ ...user });
    setError(null); // Reset error state
  };

  // Update User Function
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`api/users/${editUser._id}`, editUser);
      if (response.status === 200 && response.data.data) {
        setLoading(false);
        setIsEditing(false);
        setEditUser(null);
        await fetchUsers();
      } else {
        console.error("Unexpected API response on PUT:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error(
        "Failed to update user:",
        error.response?.data?.error || error.message
      );
      setError("Failed to update user. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
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
        <main className="p-4">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">Users</h1>
            <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
              <Button />
              <button
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0 transition duration-300"
                onClick={() => setShowForm(!showForm)}
              >
                <FaPlus className="mr-2" />
                Add Users{" "}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              {/* Close Button */}
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">New User</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Advisor">Advisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newUser.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={newUser.position}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newUser.location}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Image Upload */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
                {error && (
                  <p className="text-red-500 mt-2 text-center">{error}</p>
                )}
              </form>
            </div>
          )}
          {isEditing && editUser && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                      name="role"
                      value={editUser.role}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Advisor">Advisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editUser.firstName}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editUser.lastName}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editUser.phoneNumber}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser.email}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editUser.password}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editUser.dateOfBirth}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={editUser.position}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editUser.location}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Image Upload */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleEditImageChange} // New handler for image file input
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full"
                >
                  {loading ? "Updating..." : "Update User"}
                </button>
                {error && (
                  <p className="text-red-500 mt-2 text-center">{error}</p>
                )}
              </form>
            </div>
          )}

          {loading && !showForm && !isEditing ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRole ? (
                users.length > 0 ? (
                  users
                    .filter((user) => {
                      if (userRole === "Admin") {
                        return true; // Show all users for admin
                      } else if (userRole === "Advisor") {
                        return user.role === "Advisor"; // Show only advisor data
                      } else if (userRole === "Team Leader") {
                        return (
                          user.role === "Advisor" || user.role === "Team Leader"
                        ); // Show both advisor and team leader
                      }
                      return false;
                    })
                    .map((user) => (
                      <div
                        key={user._id}
                        className="bg-white p-4 rounded-lg shadow-md border"
                      >
                        <div className="flex flex-col items-center space-y-4">
                          {/* Avatar or Placeholder */}
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {/* Placeholder for user's avatar */}
                              <Image
                                src={user.profileImage}
                                alt={`${user.firstName} ${user.lastName}`}
                                width={80}
                                height={60}
                                className="w-full h-full object-cover rounded-full"
                              />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-700">
                            {user.firstName} {user.lastName}
                          </h2>
                          <p className="text-black text-md">
                            <span className="font-medium">Phone:</span>{" "}
                            {user.phoneNumber}
                          </p>
                          <p className="text-black text-md">
                            <span className="font-medium">Email:</span>{" "}
                            {user.email}
                          </p>
                          <p className="text-black text-md">
                            <span className="font-medium">Date of Birth:</span>{" "}
                            {new Date(user.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p className="text-black text-md">
                            <span className="font-medium">Position:</span>{" "}
                            {user.position}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                            aria-label="Edit user"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                            aria-label="Delete user"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full py-4 text-center text-gray-500">
                    No users found.
                  </div>
                )
              ) : (
                <div className="col-span-full py-4 text-center text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;