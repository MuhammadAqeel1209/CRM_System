'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    additionalInfo: '',
    productBrandName: '',
    phoneNumber: '',
    email: '',
    mainContactPerson: '',
    website: '',
  });
  const [selectedPartner, setSelectedPartner] = useState(null); // State to manage the selected partner

  // Fetch partners on component mount
//   useEffect(() => {
//     const fetchPartners = async () => {
//       try {
//         const response = await axios.get('/api/partners'); // Update endpoint as needed
//         setPartners(response.data.partners); // Adjust according to your response structure
//       } catch (error) {
//         console.error('Error fetching partners:', error);
//       }
//     };
//     fetchPartners();
//   }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPartner({ ...newPartner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/partners', newPartner); // Ensure the endpoint is correct
      setPartners([...partners, response.data.data]); // Update the partner list
      setNewPartner({
        name: '',
        additionalInfo: '',
        productBrandName: '',
        phoneNumber: '',
        email: '',
        mainContactPerson: '',
        website: '',
      });
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewPartner({
      name: '',
      additionalInfo: '',
      productBrandName: '',
      phoneNumber: '',
      email: '',
      mainContactPerson: '',
      website: '',
    });
  };

  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner); // Set the selected partner for detailed view
  };

  const handleCloseDetail = () => {
    setSelectedPartner(null); // Close the detailed view
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Partners</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Partner
            </button>
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

              <h2 className="text-xl font-semibold mb-4">New Partner</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newPartner.name}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Additional Information</label>
                    <input
                      type="text"
                      name="additionalInfo"
                      value={newPartner.additionalInfo}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Product Brand Name</label>
                    <input
                      type="text"
                      name="productBrandName"
                      value={newPartner.productBrandName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={newPartner.phoneNumber}
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
                      value={newPartner.email}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Main Contact Person</label>
                    <input
                      type="text"
                      name="mainContactPerson"
                      value={newPartner.mainContactPerson}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={newPartner.website}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
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
                    Save Partner
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
                  <th className="py-2 px-4 border-b">Main Contact</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(partner => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePartnerClick(partner)} // Add click event for detailed view
                  >
                    <td className="py-2 px-4 border-b">{partner.name}</td>
                    <td className="py-2 px-4 border-b">{partner.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{partner.email}</td>
                    <td className="py-2 px-4 border-b">{partner.mainContactPerson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed View Modal */}
          {selectedPartner && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <h2 className="text-xl font-semibold mb-4">Partner Details</h2>
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close details"
                >
                  <FaTimes size={20} />
                </button>
                <div className="mb-4">
                  <p><strong>Name:</strong> {selectedPartner.name}</p>
                  <p><strong>Additional Information:</strong> {selectedPartner.additionalInfo}</p>
                  <p><strong>Product Brand Name:</strong> {selectedPartner.productBrandName}</p>
                  <p><strong>Phone Number:</strong> {selectedPartner.phoneNumber}</p>
                  <p><strong>Email:</strong> {selectedPartner.email}</p>
                  <p><strong>Main Contact Person:</strong> {selectedPartner.mainContactPerson}</p>
                  <p><strong>Website:</strong> <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPartner.website}</a></p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Partners;
