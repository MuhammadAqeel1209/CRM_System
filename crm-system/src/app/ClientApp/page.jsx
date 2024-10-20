"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Button from "../Components/Button";
import axios from "axios";

const ClientApp = () => {
  const [notifications, setNotifications] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/contracts");
        if (response.data.success && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch contracts. Please try again later.");
      }
    };

    const fetchAdvisors = async () => {
      try {
        const response = await axios.get("/api/users");
        if (response.data.success && Array.isArray(response.data.data)) {
          // Filter users where role is 'Advisor' and set them to advisors
          const advisors = response.data.data.filter(user => user.role === "Advisor");
          setAdvisors(advisors);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch advisors. Please try again later.");
      }
    };
    

    
    fetchNotifications();
    fetchAdvisors();
   }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-4">
        <div className="flex items-center justify-between w-full md:w-auto mb-7 md:mb-0">
            <h1 className="text-2xl font-semibold">Client App</h1>
              <Button />
          </div>

          {/* Notifications */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <h2 className="font-semibold text-xl">Notifications</h2>
            <ul className="space-y-4 mt-2">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">
                      Company Name: {notification.companyName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.startDate).toLocaleDateString(
                        "en-US"
                      )}
                    </span>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Type: </span>
                    {notification.contractType}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Status: </span>
                    {notification.status}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Application Status: </span>
                    {notification.applicationStatus}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold">Expiry Date: </span>
                    {new Date(notification.expiryDate).toLocaleDateString(
                      "en-US"
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Advisor Information */}
          <div className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-4">Advisor Information</h2>
            <ul className="space-y-2">
              {advisors.map((advisor) => (
                <li
                  key={advisor._id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div>
                    <span className="font-bold"> Name: {advisor.firstName} {advisor.lastName}</span>
                    <div className="text-sm">Phone: {advisor.phoneNumber}</div>
                    <div className="text-sm">Email: {advisor.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          
        </main>
      </div>
    </div>
  );
};

export default ClientApp;
