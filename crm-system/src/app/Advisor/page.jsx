"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash, FaSadCry } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const Advisor = () => {
  const [advisors, setAdvisors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editAdvisor, setEditAdvisor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisor = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/advisors");
        if (response.data.success && Array.isArray(response.data.data)) {
          setAdvisors(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch advisor. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisor();
  }, []);

  const handleAddAdvisor = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newAdvisor.name || !newAdvisor.email || !newAdvisor.phone) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/advisors", newAdvisor);
      if (response.data.success && response.data.data) {
        setAdvisors([...advisors, response.data.data]);
        resetNewAdvisor();
        setShowAddModal(false);
      } else {
        setError("Failed to add advisor.");
      }
    } catch (err) {
      console.error("Error adding advisor:", err);
      setError("Failed to add advisor. Please try again.");
    }
  };

  // Handle input changes for adding a new advisor
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdvisor({ ...newAdvisor, [name]: value });
  };

  // Reset add advisor form
  const resetNewAdvisor = () => {
    setNewAdvisor({
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleDeleteAdvisor = async (id) => {
    if (!confirm("Are you sure you want to delete this contract?")) {
      return;
    }
    // setLoading(true);
    // setError(null);
    try {
      const res = await axios.delete(`/api/advisors/${id}`);
      if (res.status === 200) {
        setAdvisors(advisors.filter((advisor) => advisor._id !== id));
      }
    } catch (err) {
      console.error("Error deleting advisor:", err);
      setError("Failed to delete advisor. Please try again.");
    } 
  };

  // Handle editing of an advisor
  const handleEditAdvisor = (advisor) => {
    setEditAdvisor({ ...advisor });
    setShowEditModal(true);
  };

  const handleUpdateAdvisor = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!editAdvisor.name || !editAdvisor.email || !editAdvisor.phone) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `/api/advisors/${editAdvisor._id}`,
        editAdvisor
      );
      setAdvisors((prevAdvisor) =>
        prevAdvisor.map((advisors) =>
          advisors._id === editAdvisor._id ? res.data.data : advisors
        )
      );
      resetNewAdvisor();
      setShowEditModal(false);
      setLoading(false);
    } catch (err) {
      console.error(
        "Failed to update contract:",
        err.response?.data?.error || err.message
      );
      setError(err.response?.data?.error || "An unexpected error occurred");
    }
  };

  // Handle input changes for editing an advisor
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditAdvisor({ ...editAdvisor, [name]: value });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Advisors</h1>
            <button
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2" />
              Add Advisor
            </button>
          </div>

          {/* Display loading state */}
          {loading && <div className="mb-4 text-blue-500">Loading...</div>}
          {/* Advisors Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Phone</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {advisors.length > 0 ? (
                  advisors.map((advisor) => (
                    <tr
                      key={advisor._id}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="py-2 px-4 border-b">{advisor.name}</td>
                      <td className="py-2 px-4 border-b">{advisor.email}</td>
                      <td className="py-2 px-4 border-b">{advisor.phone}</td>
                      <td className="py-2 px-4 border-b" data-label="Actions">
                        <button
                          className="mr-2 text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditAdvisor(advisor)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteAdvisor(advisor._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No advisors available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Advisor Modal */}
          {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative">
                <h2 className="text-lg font-semibold mb-4">Add Advisor</h2>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAddModal(false)}
                >
                  <FaTimes />
                </button>
                <form onSubmit={handleAddAdvisor}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newAdvisor.name}
                      onChange={handleAddInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newAdvisor.email}
                      onChange={handleAddInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newAdvisor.phone}
                      onChange={handleAddInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Advisor"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Edit Advisor Modal */}
          {showEditModal && editAdvisor && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative">
                <h2 className="text-lg font-semibold mb-4">Edit Advisor</h2>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEditModal(false)}
                >
                  <FaTimes />
                </button>
                <form onSubmit={handleUpdateAdvisor}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editAdvisor.name}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editAdvisor.email}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editAdvisor.phone}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Advisor"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Advisor;
