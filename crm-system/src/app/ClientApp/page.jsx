"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";

const ClientApp = () => {
  const [notifications, setNotifications] = useState([]);
  const [contactMessage, setContactMessage] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [advisors, setAdvisors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

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
        const response = await axios.get("/api/advisors");
        if (response.data.success && Array.isArray(response.data.data)) {
          setAdvisors(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch advisors. Please try again later.");
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/msg");
        if (response.data.success && Array.isArray(response.data.data)) {
          setMessages(response.data.data);
        } else {
          setError("Unexpected response from the server.");
        }
      } catch {
        setError("Failed to fetch messages. Please try again later.");
      }
    };

    fetchNotifications();
    fetchAdvisors();
    fetchMessages(); // Fetch messages when the component mounts
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const advisor = advisors.find((advisor) => advisor._id === advisorId);

    try {
      const response = await axios.post("/api/msg", {
        advisorName: advisor ? advisor.name : "",
        message: contactMessage,
      });
      if (response.data.success) {
        setSuccessMessage("Message sent successfully!");
        setContactMessage("");
        setIsFormVisible(false);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch {
      setError("An error occurred while sending the message.");
    }
  };

  const handleContactClick = (id) => {
    setAdvisorId(id);
    setIsFormVisible(true);
    setSuccessMessage("");
    setError(null);
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
                    <span className="font-bold">{advisor.name}</span>
                    <div className="text-sm">Phone: {advisor.phoneNumber}</div>
                    <div className="text-sm">Email: {advisor.email}</div>
                  </div>
                  <button
                    onClick={() => handleContactClick(advisor._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Contact
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Messages */}
          <div className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <ul className="space-y-2">
              {messages.map((message) => (
                <li key={message._id} className="p-2 border-b">
                  <div className="font-semibold">{message.advisorName}</div>
                  <div className="text-sm">{message.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString("en-US")}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {successMessage && (
            <div className="text-green-500 mb-4">{successMessage}</div>
          )}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Contact Form */}
          {isFormVisible && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Contact Your Advisor
              </h2>
              <form
                onSubmit={handleContactSubmit}
                className="bg-white p-4 shadow-md rounded-lg"
              >
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientApp;
