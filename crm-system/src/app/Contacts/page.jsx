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
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for errors
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
    setError(null); // Reset error state
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
    setError(null); // Reset error state
  };

  // Delete Contact Function
  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    setLoading(true);
    setError(null); 

    axios
      .delete(`/api/contacts/${id}`)
      .then((res) => {
        setContacts(contacts.filter((contact) => contact._id !== id));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to delete contact:", err.response.data.error);
        setError("Failed to delete contact. Please try again.");
      });
  };

  // Edit Contact Function
  const handleEditContact = (contact) => {
    setIsEditing(true);
    setEditContact({ ...contact }); // Ensure you create a new object
    setError(null); // Reset error state
  };

  // Update Contact Function
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    axios
      .put(`/api/contacts/${editContact._id}`, editContact)
      .then((res) => {
        console.log(res)
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === editContact._id ? res.data.data : contact
          )
        );
        setLoading(false);
        setIsEditing(false);
        setEditContact(null);
      })
      .catch((err) => {
        console.error("Failed to update contact:", err.response.data.error);
        setLoading(false);
      });
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
              <h1 className="text-2xl font-semibold">Contracts</h1>
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
              {/* Close Button */}
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

          {/* Display Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {console.log(error)}
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            {loading && !showForm && !isEditing ? (
              <p>Loading contacts...</p>
            ) : (
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Lead Source</th>
                    <th className="py-2 px-4 border-b">Rating</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(contacts) && contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{contact.name}</td>
                        <td className="py-2 px-4 border-b">
                          {contact.phoneNumber}
                        </td>
                        <td className="py-2 px-4 border-b">{contact.email}</td>
                        <td className="py-2 px-4 border-b">{contact.type}</td>
                        <td className="py-2 px-4 border-b">
                          {contact.leadSource}
                        </td>
                        <td className="py-2 px-4 border-b">{contact.rating}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          {/* Update Button */}
                          <button
                            onClick={() => handleEditContact(contact)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Edit ${contact.name}`}
                          >
                            <FaEdit />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete ${contact.name}`}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-4 text-center">
                        No contacts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Edit Contact Modal */}
          {isEditing && editContact && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-96 relative">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContact(null);
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
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
                        value={editContact.leadSource}
                        onChange={handleEditInputChange}
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
                        value={editContact.rating}
                        onChange={handleEditInputChange}
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
                      onClick={() => {
                        setIsEditing(false);
                        setEditContact(null);
                      }}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Contacts;
