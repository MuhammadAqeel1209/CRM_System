"use client";
import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
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
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
  

      const response = await axios.post("/api/users", newUser);
      if (response.data.success && response.data.data) {
        userRegisterSuccessfully()
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      setError("Failed to add user. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

   const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    if (imageUrl) {
      setNewUser({ ...newUser, profileImage: imageUrl });
    }
  };

 const  userRegisterSuccessfully = () =>{
    setNewUser({ role: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        email: "",
        dateOfBirth: "",
        position: "",
        location: "",
      })
      router.push("/")
  }

  return (
    <div className="flex pt-5 bg-gray-100 items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl mx-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register New User</h1>
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
    </div>
  );
};

export default SignUp;