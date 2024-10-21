"use client";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    type: "",
    leadSource: "",
    rating: "",
    level: "",
  });

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/contacts");
        if (response.data.success && Array.isArray(response.data.data)) {
          setContacts(response.data.data);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError("Failed to fetch contacts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/contacts", newContact);
      if (response.data.success && response.data.data) {
        setContacts([...contacts, response.data.data]);
        setNewContact({
          name: "",
          phoneNumber: "",
          email: "",
          type: "",
          leadSource: "",
          rating: "",
          level: "",
        });
        setShowForm(false);
      } else {
        console.error("Unexpected API response on POST:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      setError("Failed to add contact. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewContact({
      name: "",
      phoneNumber: "",
      email: "",
      type: "",
      leadSource: "",
      rating: "",
      level: "",
    });
    setError(null);
  };

  // Delete Contact Function
  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to delete contact:", err.response.data.error);
      setError("Failed to delete contact. Please try again.");
    }
  };

  // Edit Contact Function
  const handleEditContact = (contact) => {
    setIsEditing(true);
    setEditContact({ ...contact });
    setError(null);
  };

  // Update Contact Function
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/contacts/${editContact._id}`, editContact);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === editContact._id ? res.data.data : contact
        )
      );
      setLoading(false);
      setIsEditing(false);
      setEditContact(null);
    } catch (err) {
      console.error("Failed to update contact:", err.response.data.error);
      setLoading(false);
    }
  };

  // Handle change in edit form fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditContact({ ...editContact, [name]: value });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-4">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
              <Button />
              <button
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0 transition duration-300"
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="mr-2" />
                Add Contact
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">New Contact</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newContact.name}
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
                      value={newContact.phoneNumber}
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
                      value={newContact.email}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Contact Type</label>
                    <select
                      name="type"
                      value={newContact.type}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Client">Client</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Lead Source</label>
                    <select
                      name="leadSource"
                      value={newContact.leadSource}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Lead Source</option>
                      <option value="Referral">Referral</option>
                      <option value="Website">Website</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Rating</label>
                    <select
                      name="rating"
                      value={newContact.rating}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Rating</option>
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Contact"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && <div className="flex justify-center">Loading contacts...</div>}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
          )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white p-4 rounded-lg shadow-md border transition-transform transform hover:scale-105"
                >
                  <h2 className="text-lg font-semibold text-gray-700">
                    Name: {contact.name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Phone Number:</strong> {contact.phoneNumber}
                  </p>
                  <p className="text-gray-600">
                    <strong>Email :</strong> {contact.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Type:</strong> {contact.type}
                  </p>
                  <p className="text-gray-600">
                    <strong>Lead Source:</strong>{" "}
                    {contact.leadSource}
                  </p>
                  <p className="text-gray-600">
                    <strong>Rating:</strong>{" "}
                    {contact.rating}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditContact(contact)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteContact(contact._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-4 text-center text-gray-500">
                No contacts available.
              </div>
            )}
          </div>


          {isEditing && (
            <div className="bg-white p-6 shadow rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editContact.name}
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
                      value={editContact.phoneNumber}
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
                      value={editContact.email}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Contact Type</label>
                    <select
                      name="type"
                      value={editContact.type}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="Prospect">Prospect</option>
                      <option value="Client">Client</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Lead Source</label>
                    <select
                      name="leadSource"
                      value={editContact.leadSource}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="Referral">Referral</option>
                      <option value="Website">Website</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Rating</label>
                    <select
                      name="rating"
                      value={editContact.rating}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Contact"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Contacts;
