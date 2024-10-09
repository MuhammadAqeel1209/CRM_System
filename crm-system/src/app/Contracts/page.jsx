'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContract, setNewContract] = useState({
    policyNumber: '',
    company: '',
    contractType: '',
    status: '',
    totalPremium: '',
    startDate: '',
    expiryDate: ''
  });

  // Define options for contract types and statuses
  const contractTypes = ['Type A', 'Type B', 'Type C']; // Example types
  const statuses = ['Active', 'Inactive', 'Pending']; // Example statuses

  // useEffect(() => {
  //   // Fetch contracts from API (replace with your API endpoint)
  //   axios.get('/api/contracts')
  //     .then(response => setContracts(response.data))
  //     .catch(error => console.error(error));
  // }, []);

  const handleAddContract = () => {
    // Validate required fields (optional but recommended)
    if (
      !newContract.policyNumber ||
      !newContract.company ||
      !newContract.contractType ||
      !newContract.status ||
      !newContract.totalPremium ||
      !newContract.startDate ||
      !newContract.expiryDate
    ) {
      alert('Please fill in all fields.');
      return;
    }

    // Send new contract data to the API (replace with your API endpoint)
    axios.post('/api/contracts', newContract)
      .then(response => {
        setContracts([...contracts, response.data]); // Update the state with new contract
        setShowModal(false); // Close modal after submission
        setNewContract({
          policyNumber: '',
          company: '',
          contractType: '',
          status: '',
          totalPremium: '',
          startDate: '',
          expiryDate: ''
        }); // Reset form
      })
      .catch(error => console.error(error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContract({ ...newContract, [name]: value });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Contracts</h1>
            <button
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0"
              onClick={() => setShowModal(true)} // Open modal on click
            >
              <FaPlus className="mr-2" />
              Add Contract
            </button>
          </div>

          {/* Contract Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th scope="col" className="py-2 px-4 border-b text-left">ID</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Policy Number</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Company</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Contract Type</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Status</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Total Premium</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Start Date</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Expiry Date</th>
                  <th scope="col" className="py-2 px-4 border-b text-left">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 px-4 border-b" data-label="ID">{contract.id}</td>
                    <td className="py-2 px-4 border-b" data-label="Policy Number">{contract.policyNumber}</td>
                    <td className="py-2 px-4 border-b" data-label="Company">{contract.company}</td>
                    <td className="py-2 px-4 border-b" data-label="Contract Type">{contract.contractType}</td>
                    <td className="py-2 px-4 border-b" data-label="Status">{contract.status}</td>
                    <td className="py-2 px-4 border-b" data-label="Total Premium">${contract.totalPremium}</td>
                    <td className="py-2 px-4 border-b" data-label="Start Date">{contract.startDate}</td>
                    <td className="py-2 px-4 border-b" data-label="Expiry Date">{contract.expiryDate}</td>
                    <td className="py-2 px-4 border-b" data-label="Last Updated">{contract.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal for Adding Contract */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Contract</h2>
              <FaTimes className="cursor-pointer text-gray-600" onClick={() => setShowModal(false)} />
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Policy Number */}
              <div className="flex flex-col">
                <label htmlFor="policyNumber" className="mb-1 font-medium">Policy Number</label>
                <input
                  type="text"
                  id="policyNumber"
                  name="policyNumber"
                  placeholder="Policy Number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.policyNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Company */}
              <div className="flex flex-col">
                <label htmlFor="company" className="mb-1 font-medium">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Company"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.company}
                  onChange={handleInputChange}
                />
              </div>

              {/* Contract Type */}
              <div className="flex flex-col">
                <label htmlFor="contractType" className="mb-1 font-medium">Contract Type</label>
                <select
                  id="contractType"
                  name="contractType"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.contractType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Contract Type</option>
                  {contractTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label htmlFor="status" className="mb-1 font-medium">Status</label>
                <select
                  id="status"
                  name="status"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Total Premium */}
              <div className="flex flex-col">
                <label htmlFor="totalPremium" className="mb-1 font-medium">Total Premium</label>
                <input
                  type="number"
                  id="totalPremium"
                  name="totalPremium"
                  placeholder="Total Premium"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.totalPremium}
                  onChange={handleInputChange}
                />
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <label htmlFor="startDate" className="mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.startDate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Expiry Date */}
              <div className="flex flex-col">
                <label htmlFor="expiryDate" className="mb-1 font-medium">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newContract.expiryDate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end col-span-1 md:col-span-2">
                <button
                  type="button"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={handleAddContract}
                >
                  Add Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
