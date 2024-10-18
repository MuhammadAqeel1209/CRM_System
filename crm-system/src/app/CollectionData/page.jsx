"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const CollectionData = () => {
  const [contacts, setContacts] = useState([]);
  const [collection, setCollection] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    title: "",
    linkedToContactId: "",
    linkedToContractId: "",
    contactPhase: "",
    assignedToUserId: "",
  });
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");
  const [editCollection, setEditCollection] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching the users, contracts, and contacts in parallel
        const [usersResponse, contractsResponse, contactsResponse] =
          await Promise.all([
            axios.get("/api/users"),
            axios.get("/api/contracts"),
            axios.get("/api/contacts"),
          ]);

        // Setting the state based on API responses
        if (usersResponse.data && Array.isArray(usersResponse.data.data)) {
          setUsers(usersResponse.data.data);
        }

        if (
          contractsResponse.data &&
          Array.isArray(contractsResponse.data.data)
        ) {
          setContracts(contractsResponse.data.data);
        }

        if (
          contactsResponse.data &&
          Array.isArray(contactsResponse.data.data)
        ) {
          setContacts(contactsResponse.data.data);
        }
      } catch (error) {
        // Set error message if fetching fails
        setError("Failed to fetch data.");
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get("/api/collections");
        if (response.data.success && Array.isArray(response.data.data)) {
          setCollection(response.data.data);
        }
      } catch {
        console.log("Failed to fetch collection. Please try again later.");
      }
    };

    fetchCollection();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCollection({ ...editCollection, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log(newCollection);
      const response = await axios.post("/api/collections", newCollection);
      setCollection([
        ...collection,
        { ...response.data.data, _id: response.data.data._id.toString() },
      ]);
      setShowForm(false);
      setNewCollection({
        title: "",
        linkedToContactId: "",
        linkedToContractId: "",
        contactPhase: "",
        assignedToUserId: "",
      });
    } catch (error) {
      setError("Failed to add collection.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `/api/collections/${editCollection._id}`,
        editCollection
      );
      const updatedCollection = {
        ...res.data.data,
        _id: res.data.data._id.toString(),
      };
      setCollection(
        collection.map((collect) =>
          collect._id === editCollection._id ? updatedCollection : collect
        )
      );
      setEditCollection(null);
      setShowEditModal(false);
    } catch (error) {
      setError("Failed to update collection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      try {
        await axios.delete(`/api/collections/${id}`);
        setCollection(collection.filter((collect) => collect._id !== id));
      } catch (error) {
        setError("Failed to delete collection.");
      }
    }
  };

  const handleEditCollection = (collect) => {
    setEditCollection(collect);
    setShowEditModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Collections</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditCollection(null);
                setError("");
              }}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Collection
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newCollection.title}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Linked to Contact</label>
                    <select
                      name="linkedToContactId"
                      value={newCollection.linkedToContactId}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select a Contact</option>
                      {contacts.map((contact) => (
                        <option key={contact._id} value={contact._id}>
                          {contact.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Linked to Contract</label>
                    <select
                      name="linkedToContractId"
                      value={newCollection.linkedToContractId}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select a Contract</option>
                      {contracts.map((contract) => (
                        <option key={contract._id} value={contract._id}>
                          {contract.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Contact Phase</label>
                    <select
                      name="contactPhase"
                      value={newCollection.contactPhase}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Phase</option>
                      <option value="Lead">Lead</option>
                      <option value="Client">Client</option>
                      <option value="Closure">Closure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Assigned to User</label>
                    <select
                      name="assignedToUserId"
                      value={newCollection.assignedToUserId}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select a User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Collection
                  </button>
                </div>
              </form>
            </div>
          )}

          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="py-2 border-b">Created On</th>
                <th className="py-2 border-b">Title</th>
                <th className="py-2 border-b">Linked to Contact</th>
                <th className="py-2 border-b">Linked to Contract</th>
                <th className="py-2 border-b">Phase Contact</th>
                <th className="py-2 border-b">Assigned to</th>
                <th className="py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((collect) => (
                <tr key={collect._id}>
                  <td className="py-2 px-5 border-b">
                    {new Date(collect.createdOn).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-7 border-b">{collect.title}</td>
                  <td className="py-2 px-10 border-b">
                    {
                      contacts.find(
                        (contact) => contact._id === collect.linkedToContactId
                      )?.name
                    }
                  </td>
                  <td className="py-2 px-10 border-b">
                    {
                      contracts.find(
                        (contract) =>
                          contract._id === collect.linkedToContractId
                      )?.companyName
                    }
                  </td>
                  <td className="py-2 px-7 border-b">{collect.contactPhase}</td>
                  <td className="py-2 px-7 border-b">
                    {
                      users.find(
                        (user) => user._id === collect.assignedToUserId
                      )?.firstName
                    }
                  </td>
                  <td className="py-2 px-7 border-b flex gap-2">
                    <button
                      onClick={() => handleEditCollection(collect)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collect._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>

      {/* Modal for editing collection */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>

            <form onSubmit={handleUpdateSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editCollection.title}
                    onChange={handleEditInputChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Linked to Contact</label>
                  <select
                    name="linkedToContactId"
                    value={editCollection.linkedToContactId}
                    onChange={handleEditInputChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select a Contact</option>
                    {contacts.map((contact) => (
                      <option key={contact._id} value={contact._id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Linked to Contract</label>
                  <select
                    name="linkedToContractId"
                    value={editCollection.linkedToContractId}
                    onChange={handleEditInputChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select a Contract</option>
                    {contracts.map((contract) => (
                      <option key={contract._id} value={contract._id}>
                        {contract.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Contact Phase</label>
                  <select
                    name="contactPhase"
                    value={editCollection.contactPhase}
                    onChange={handleEditInputChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select Phase</option>
                    <option value="Lead">Lead</option>
                    <option value="Client">Client</option>
                    <option value="Closure">Closure</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Assigned to User</label>
                  <select
                    name="assignedToUserId"
                    value={editCollection.assignedToUserId}
                    onChange={handleEditInputChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select a User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {loading ? "Saving..." : "Update Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionData;
