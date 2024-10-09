'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';

const ClientApp = () => {
  const [clientPolicies, setClientPolicies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Fetch client policies and notifications on component mount
  useEffect(() => {
    const fetchPoliciesAndNotifications = async () => {
      try {
        const [policiesResponse, notificationsResponse] = await Promise.all([
          axios.get('/api/client/policies'), // Adjust endpoint as needed
          axios.get('/api/client/notifications'), // Adjust endpoint as needed
        ]);
        setClientPolicies(policiesResponse.data.policies);
        setNotifications(notificationsResponse.data.notifications);
      } catch (error) {
        console.error('Error fetching policies or notifications:', error);
      }
    };

    fetchPoliciesAndNotifications();
  }, []);

  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy); // Show detailed view of selected policy
  };

  const handleCloseDetail = () => {
    setSelectedPolicy(null); // Close detailed view
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Client App</h1>

          {/* Notifications */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <h2 className="font-semibold">Notifications</h2>
            <ul className="list-disc list-inside">
              {notifications.map(notification => (
                <li key={notification.id}>{notification.message}</li>
              ))}
            </ul>
          </div>

          {/* Policies Overview */}
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Client Policies</h2>
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Policy Number</th>
                  <th className="py-2 px-4 border-b">Company</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Expiry Date</th>
                  <th className="py-2 px-4 border-b">Advisor</th>
                </tr>
              </thead>
              <tbody>
                {clientPolicies.map(policy => (
                  <tr
                    key={policy.policyNumber}
                    onClick={() => handlePolicyClick(policy)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border-b">{policy.policyNumber}</td>
                    <td className="py-2 px-4 border-b">{policy.company}</td>
                    <td className="py-2 px-4 border-b">{policy.status}</td>
                    <td className="py-2 px-4 border-b">{policy.expiryDate}</td>
                    <td className="py-2 px-4 border-b">{policy.advisor.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Policy Detail Modal */}
          {selectedPolicy && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 shadow-lg rounded-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
                <p><strong>Policy Number:</strong> {selectedPolicy.policyNumber}</p>
                <p><strong>Company:</strong> {selectedPolicy.company}</p>
                <p><strong>Status:</strong> {selectedPolicy.status}</p>
                <p><strong>Expiry Date:</strong> {selectedPolicy.expiryDate}</p>
                <h3 className="font-semibold mt-4">Advisor Information</h3>
                <p><strong>Name:</strong> {selectedPolicy.advisor.name}</p>
                <p><strong>Email:</strong> {selectedPolicy.advisor.email}</p>
                <p><strong>Phone:</strong> {selectedPolicy.advisor.phone}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCloseDetail}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedPolicy.advisor.email}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                  >
                    Contact Advisor
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientApp;
