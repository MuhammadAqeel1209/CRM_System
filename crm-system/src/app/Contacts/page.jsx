'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch contacts from API (replace with your API endpoint)
    axios.get('/api/contacts')
      .then(response => setContacts(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <FaPlus className="mr-2" />
              Add Contact
            </button>
          </div>
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
                  <tr key={contact.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 px-4 border-b">{`${contact.firstName} ${contact.lastName}`}</td>
                    <td className="py-2 px-4 border-b">{contact.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{contact.email}</td>
                    <td className="py-2 px-4 border-b">{contact.contactType}</td>
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
