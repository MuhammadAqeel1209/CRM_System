"use client";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    additionalInfo: "",
    productBrandName: "",
    phoneNumber: "",
    email: "",
    mainContactPersonId: "",
    website: "",
  });
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [editPartner, setEditPartner] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state during update

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setRole(parsedRole.value); // Set the user role state
  }, []);

  // Fetch contacts and partners on component mount
  useEffect(() => {
    const fetchContacts = async () => {
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
      }
    };

    const fetchPartners = async () => {
      try {
        const response = await axios.get("/api/partners");
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log("Fetched Partners:", response.data.data); // Inspect data
          // Ensure each partner has a string _id
          const transformedPartners = response.data.data.map((partner) => ({
            ...partner,
            _id: partner._id.toString(),
          }));
          setPartners(transformedPartners);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Failed to fetch partners. Please try again later.");
      }
    };

    fetchContacts();
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPartner({ ...newPartner, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPartner({ ...editPartner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/api/partners", newPartner);
      // Ensure the new partner has a string _id
      const createdPartner = {
        ...response.data.data,
        _id: response.data.data._id.toString(),
      };
      setPartners([...partners, createdPartner]);
      setNewPartner({
        name: "",
        additionalInfo: "",
        productBrandName: "",
        phoneNumber: "",
        email: "",
        mainContactPersonId: "",
        website: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding partner:", error);
      setError(
        error.response?.data?.error ||
          "Failed to add partner. Please try again."
      );
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.put(
        `/api/partners/${editPartner._id}`,
        editPartner
      );
      const updatedPartner = {
        ...res.data.data,
        _id: res.data.data._id.toString(),
      };
      setPartners((prevPartners) =>
        prevPartners.map((partner) =>
          partner._id === editPartner._id ? updatedPartner : partner
        )
      );
      setEditPartner(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update Partner:", error);
      setError(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewPartner({
      name: "",
      additionalInfo: "",
      productBrandName: "",
      phoneNumber: "",
      email: "",
      mainContactPersonId: "",
      website: "",
    });
    setError("");
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Partner?"))
      return;
    try {
      const response = await axios.delete(`/api/partners/${id}`);
      if (response.status === 200) {
        setPartners(partners.filter((partner) => partner._id !== id));
      } else {
        setError("Failed to delete partner. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      setError("Failed to delete partner. Please try again.");
    }
  };

  const handleEditPartner = (partner) => {
    setEditPartner({ ...partner });
    setShowEditModal(true);
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-4">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">Partner OverView</h1>
            <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
              <Button />
              <button
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0 transition duration-300"
                onClick={() => {
                  setShowForm(!showForm);
                  setEditPartner(null);
                  setError("");
                }}
              >
                <FaPlus className="mr-2" />
                Add Partners{" "}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editPartner ? "Edit Partner" : "New Partner"}
              </h2>
              <form onSubmit={editPartner ? handleUpdateSubmit : handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editPartner ? editPartner.name : newPartner.name}
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Additional Information</label>
                    <input
                      type="text"
                      name="additionalInfo"
                      value={
                        editPartner
                          ? editPartner.additionalInfo
                          : newPartner.additionalInfo
                      }
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Product Brand Name</label>
                    <input
                      type="text"
                      name="productBrandName"
                      value={
                        editPartner
                          ? editPartner.productBrandName
                          : newPartner.productBrandName
                      }
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={
                        editPartner
                          ? editPartner.phoneNumber
                          : newPartner.phoneNumber
                      }
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editPartner ? editPartner.email : newPartner.email}
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Main Contact Person</label>
                    <select
                      name="mainContactPersonId"
                      value={
                        editPartner
                          ? editPartner.mainContactPersonId
                          : newPartner.mainContactPersonId
                      }
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select a Contact</option>
                      {contacts.map((contact) => (
                        <option key={contact._id} value={contact._id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={
                        editPartner ? editPartner.website : newPartner.website
                      }
                      onChange={
                        editPartner ? handleEditInputChange : handleInputChange
                      }
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
                    disabled={loading}
                  >
                    {loading
                      ? editPartner
                        ? "Updating..."
                        : "Saving..."
                      : editPartner
                      ? "Update Partner"
                      : "Save Partner"}
                  </button>
                </div>
              </form>
            </div>
          )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <div
                    key={partner._id}
                    className="bg-white p-4 rounded-lg shadow-md border transition-transform transform hover:scale-105"
                  >
                    <h2 className="text-lg font-semibold text-gray-700">
                      Name: {partner.name}
                    </h2>
                    <p className="text-gray-600">
                      <strong> Product Brand:</strong> {partner.productBrandName}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone Number:</strong> {partner.phoneNumber}
                    </p>
                    <p className="text-gray-600">
                      <strong>Email :</strong> {partner.email}
                    </p>
                    <p className="text-gray-600">
                      <strong>Main Contact:</strong>  {contacts.find(
                        (contact) => contact._id === partner.mainContactPersonId
                      )?.name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Website:</strong><a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {partner.website}
                        </a>
                    </p>
                  <div className="mt-4 flex justify-between">
                      {role === "Admin" && ( 
                        <>
                      <button
                         onClick={() => handleEditPartner(partner)}
                        className="text-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePartner(partner._id)}
                      >
                        <FaTrash />
                      </button>
                      </>
                      )}
                     
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-gray-500">
                  No courses available.
                </div>
              )}
            </div>

          {/* Edit Partner Modal */}
          {showEditModal && editPartner && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close edit modal"
                >
                  <FaTimes size={20} />
                </button>
                <h2 className="text-lg font-semibold mb-4">Edit Partner</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editPartner.name}
                      onChange={handleEditInputChange}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Additional Information</label>
                    <input
                      type="text"
                      name="additionalInfo"
                      value={editPartner.additionalInfo}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Product Brand Name</label>
                    <input
                      type="text"
                      name="productBrandName"
                      value={editPartner.productBrandName}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editPartner.phoneNumber}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editPartner.email}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Main Contact Person</label>
                    <select
                      name="mainContactPersonId"
                      value={editPartner.mainContactPersonId}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select a Contact</option>
                      {contacts.map((contact) => (
                        <option key={contact._id} value={contact._id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={editPartner.website}
                      onChange={handleEditInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Partner"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Partners;
