'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);

  // useEffect(() => {
  //   // Fetch contracts from API (replace with your API endpoint)
  //   axios.get('/api/contracts')
  //     .then(response => setContracts(response.data))
  //     .catch(error => console.error(error));
  // }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Contracts</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Policy Number</th>
                  <th className="py-2 px-4 border-b">Company</th>
                  <th className="py-2 px-4 border-b">Contract Type</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Total Premium</th>
                  <th className="py-2 px-4 border-b">Start Date</th>
                  <th className="py-2 px-4 border-b">Expiry Date</th>
                  <th className="py-2 px-4 border-b">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 px-4 border-b">{contract.id}</td>
                    <td className="py-2 px-4 border-b">{contract.policyNumber}</td>
                    <td className="py-2 px-4 border-b">{contract.company}</td>
                    <td className="py-2 px-4 border-b">{contract.contractType}</td>
                    <td className="py-2 px-4 border-b">{contract.status}</td>
                    <td className="py-2 px-4 border-b">{contract.totalPremium}</td>
                    <td className="py-2 px-4 border-b">{contract.startDate}</td>
                    <td className="py-2 px-4 border-b">{contract.expiryDate}</td>
                    <td className="py-2 px-4 border-b">{contract.lastUpdated}</td>
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

export default Contracts;
