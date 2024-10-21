"use client";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newContract, setNewContract] = useState({
    policyNumber: "",
    companyName: "",
    contractType: "",
    status: "",
    applicationStatus: "",
    totalPremium: "",
    startDate: "",
    expiryDate: "",
  });
  const [editContract, setEditContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contractTypes = [
    "Sales Contracts",
    "Service Contracts",
    "Subscription Contracts",
    "Partner Contracts",
    "Employment Contracts",
    "Project-Based Contracts",
    "Vendor/Supplier Contracts",
  ];
  const statuses = ["Active", "Inactive", "Pending", "Completed"];
  const applicationStatuses = ["New", "In Review", "Approved", "Rejected"];

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/contracts");
        if (response.data.success && Array.isArray(response.data.data)) {
          setContracts(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch contracts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleAddContract = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (new Date(newContract.startDate) > new Date(newContract.expiryDate)) {
      setError("Start Date must be before Expiry Date.");
      setLoading(false);
      return;
    }

    if (
      isNaN(parseFloat(newContract.totalPremium)) ||
      parseFloat(newContract.totalPremium) <= 0
    ) {
      setError("Total Premium must be a positive number.");
      setLoading(false);
      return;
    }

    const contractToSend = {
      ...newContract,
      totalPremium: parseFloat(newContract.totalPremium),
    };

    try {
      const response = await axios.post("/api/contracts", contractToSend);
      if (response.data.success && response.data.data) {
        setContracts([...contracts, response.data.data]);
        resetNewContract();
        setShowModal(false);
      } else {
        setError("Unexpected response from the server.");
      }
    } catch {
      setError("Failed to add contract.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContract({ ...newContract, [name]: value });
  };

  const handleDeleteContract = async (id) => {
    if (!confirm("Are you sure you want to delete this contract?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`/api/contracts/${id}`);
      if (res.status === 200) {
        setContracts(contracts.filter((contract) => contract._id !== id));
      }
    } catch {
      setError("Failed to delete contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditContract = (contract) => {
    setEditContract({ ...contract });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.put(
        `/api/contracts/${editContract._id}`,
        editContract
      );
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract._id === editContract._id ? res.data.data : contract
        )
      );
      resetEditContract();
      setShowEditModal(false);
    } catch (err) {
      console.error(
        "Failed to update contract:",
        err.response?.data?.error || err.message
      );
      setError(err.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditContract({ ...editContract, [name]: value });
  };

  const resetNewContract = () => {
    setNewContract({
      policyNumber: "",
      companyName: "",
      contractType: "",
      status: "",
      applicationStatus: "",
      totalPremium: "",
      startDate: "",
      expiryDate: "",
    });
  };

  const resetEditContract = () => {
    setEditContract(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-4">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">Contracts</h1>
            <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
              <Button />
              <button
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0 transition duration-300"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="mr-2" />
                Add Contract
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
              Loading...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <div
                  key={contract._id}
                  className="bg-white p-4 rounded-lg shadow-md border transition-transform transform hover:scale-105"
                >
                  <h2 className="text-lg font-semibold text-gray-700">
                    Policy Number: {contract.policyNumber}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Company Name:</strong> {contract.companyName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Contract Type:</strong> {contract.contractType}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {contract.status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Application Status:</strong>{" "}
                    {contract.applicationStatus}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Premium:</strong>{" "}
                    {contract.totalPremium.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className="text-gray-600">
                    <strong>Start Date:</strong>{" "}
                    {new Date(contract.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>Expiry Date:</strong>{" "}
                    {new Date(contract.expiryDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditContract(contract)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteContract(contract._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-4 text-center text-gray-500">
                No contracts available.
              </div>
            )}
          </div>

          {/* Add Contract Modal */}
          {showModal && (
            <div className="flex pt-5 bg-gray-100 items-center justify-center">
              <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl mx-4">
                <h2 className="text-lg font-semibold mb-4">Add Contract</h2>
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes />
                </button>
                <form onSubmit={handleAddContract}>
                  <div className="mb-4">
                    <label htmlFor="policyNumber" className="block mb-1">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      id="policyNumber"
                      name="policyNumber"
                      value={newContract.policyNumber}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="companyName" className="block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={newContract.companyName}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contractType" className="block mb-1">
                      Contract Type
                    </label>
                    <select
                      id="contractType"
                      name="contractType"
                      value={newContract.contractType}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Contract Type</option>
                      {contractTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newContract.status}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="applicationStatus" className="block mb-1">
                      Application Status
                    </label>
                    <select
                      id="applicationStatus"
                      name="applicationStatus"
                      value={newContract.applicationStatus}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Application Status</option>
                      {applicationStatuses.map((appStatus) => (
                        <option key={appStatus} value={appStatus}>
                          {appStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="totalPremium" className="block mb-1">
                      Total Premium
                    </label>
                    <input
                      type="number"
                      id="totalPremium"
                      name="totalPremium"
                      value={newContract.totalPremium}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="startDate" className="block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newContract.startDate}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="expiryDate" className="block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={newContract.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Contract"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Edit Contract Modal */}
          {showEditModal && (
            <div className="flex pt-5 bg-gray-100 items-center justify-center">
              <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl mx-4">
                <h2 className="text-lg font-semibold mb-4">Edit Contract</h2>
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setShowEditModal(false)}
                >
                  <FaTimes />
                </button>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-4">
                    <label htmlFor="policyNumber" className="block mb-1">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      id="policyNumber"
                      name="policyNumber"
                      value={editContract.policyNumber}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="companyName" className="block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={editContract.companyName}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contractType" className="block mb-1">
                      Contract Type
                    </label>
                    <select
                      id="contractType"
                      name="contractType"
                      value={editContract.contractType}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Contract Type</option>
                      {contractTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={editContract.status}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="applicationStatus" className="block mb-1">
                      Application Status
                    </label>
                    <select
                      id="applicationStatus"
                      name="applicationStatus"
                      value={editContract.applicationStatus}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Select Application Status</option>
                      {applicationStatuses.map((appStatus) => (
                        <option key={appStatus} value={appStatus}>
                          {appStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="totalPremium" className="block mb-1">
                      Total Premium
                    </label>
                    <input
                      type="number"
                      id="totalPremium"
                      name="totalPremium"
                      value={editContract.totalPremium}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="startDate" className="block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editContract.startDate}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="expiryDate" className="block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={editContract.expiryDate}
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
                    {loading ? "Updating..." : "Update Contract"}
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

export default Contracts;
