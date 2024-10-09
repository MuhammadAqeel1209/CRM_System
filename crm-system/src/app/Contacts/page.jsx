'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa'; // Import FaTimes for the close icon

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    type: '',
    leadSource: '',
    rating: '',
    level: '' // Added to match your contact overview attributes
  });

  // Fetch contacts on component mount
  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     try {
  //       const response = await axios.get('/api/contacts'); // Update endpoint as needed
  //       setContacts(response.data.contacts); // Adjust according to your response structure
  //     } catch (error) {
  //       console.error('Error fetching contacts:', error);
  //     }
  //   };
  //   fetchContacts();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contacts', newContact); // Ensure the endpoint is correct
      setContacts([...contacts, response.data.data]); // Update the contact list
      setNewContact({ name: '', phoneNumber: '', email: '', type: '', leadSource: '', rating: '', level: '' });
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error adding contact:', error);
      // Optionally, display error feedback to the user
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewContact({ name: '', phoneNumber: '', email: '', type: '', leadSource: '', rating: '', level: '' });
  };

  const handleContactClick = (contact) => {
    // Handle detailed view for the clicked contact (you can implement a modal or redirect)
    console.log('Clicked contact:', contact);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Contact
            </button>
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
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Lead Source</th>
                  <th className="py-2 px-4 border-b">Rating</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleContactClick(contact)} // Add click event for detailed view
                  >
                    <td className="py-2 px-4 border-b">{contact.name}</td>
                    <td className="py-2 px-4 border-b">{contact.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{contact.email}</td>
                    <td className="py-2 px-4 border-b">{contact.type}</td>
                    <td className="py-2 px-4 border-b">{contact.leadSource}</td>
                    <td className="py-2 px-4 border-b">{contact.rating}</td>
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

export default Contacts;
