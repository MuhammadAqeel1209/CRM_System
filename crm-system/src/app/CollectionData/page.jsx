"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const DataCollection = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newData, setnewData] = useState({
    title: "",
    linkedTo: "",
    contactPhase: "",
    assignedTo: "",
  });
  const [dataTask, setDataTask] = useState(null);
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [linkedOptions, setLinkedOptions] = useState([]);
  const [editAssignedOptions, setEditAssignedOptions] = useState([]);
  const [editLinkedOptions, setEditLinkedOptions] = useState([]);

  // Sample options for linked to and assigned to fields
  const options = {
    types: ["contact", "contract"],
  };
  const users = {
    types: ["user"],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/contact-data");
        if (response.data.success && Array.isArray(response.data.data)) {
          setData(response.data.data);
        }
      } catch {
        console.log("Failed to fetch contracts. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Fetch Assigned Options based on type for Add Task form
  useEffect(() => {
    const fetchAssignedOptions = async () => {
      if (newData.assignedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setAssignedOptions(res.data.data); // Adjust based on your API response
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setAssignedOptions([]);
        }
      } else if (newData.assignedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setAssignedOptions([]);
        }
      } else if (newData.assignedType === "user") {
        try {
          const res = await axios.get("/api/users");
          setAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setAssignedOptions([]);
        }
      } else {
        setAssignedOptions([]);
      }
    };
    fetchAssignedOptions();
  }, [newData.assignedType]);

  // Fetch Linked Options based on type for Add Task form
  useEffect(() => {
    const fetchLinkedOptions = async () => {
      if (newData.linkedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setLinkedOptions(res.data.data); // Adjust based on your API response
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setLinkedOptions([]);
        }
      } else if (newData.linkedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setLinkedOptions([]);
        }
      } else if (newData.linkedType === "user") {
        try {
          const res = await axios.get("/api/users");
          setLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLinkedOptions([]);
        }
      } else {
        setLinkedOptions([]);
      }
    };
    fetchLinkedOptions();
  }, [newData.linkedType]);

  // Handle input changes for Add Task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewData((prevTask) => ({
      ...prevTask,
      [name]: value,
      // Reset dependent fields if type changes
      ...(name === "assignedType" && { assignedTo: "" }),
      ...(name === "linkedType" && { linkedTo: "" }),
    }));
  };

  // Handle form submission for Add Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/contact-data", newData); // Ensure the endpoint is correct
      setData([...data, response.data.data]); // Update the task list
      setnewData({
        title: "",
        linkedTo: "",
        contactPhase: "",
        assignedTo: "",
      });
      setShowForm(false); // Hide the form after submission
      setAssignedOptions([]);
      setLinkedOptions([]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle closing the Add Task form
  const handleCloseForm = () => {
    setShowForm(false);
    setnewData({
        title: "",
        linkedTo: "",
        contactPhase: "",
        assignedTo: "",
    });
    setAssignedOptions([]);
    setLinkedOptions([]);
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Are you sure to delete this task??")) return;
    axios
      .delete(`/api/contact-data/${id}`)
      .then((res) => {
        setData(data.filter((task) => task._id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Handle closing the detail view
  const handleCloseDetail = () => {
    setDataTask(null); // Close the detailed view
    setEditAssignedOptions([]);
    setEditLinkedOptions([]);
  };

  // Fetch Assigned Options based on type for Edit Task form
  useEffect(() => {
    const fetchEditAssignedOptions = async () => {
      if (dataTask?.assignedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setEditAssignedOptions([]);
        }
      } else if (dataTask?.assignedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setEditAssignedOptions([]);
        }
      } else if (dataTask?.assignedType === "user") {
        try {
          const res = await axios.get("/api/users");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setEditAssignedOptions([]);
        }
      } else {
        setEditAssignedOptions([]);
      }
    };
    fetchEditAssignedOptions();
  }, [dataTask?.assignedType]);

  // Fetch Linked Options based on type for Edit Task form
  useEffect(() => {
    const fetchEditLinkedOptions = async () => {
      if (dataTask?.linkedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setEditLinkedOptions([]);
        }
      } else if (dataTask?.linkedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setEditLinkedOptions([]);
        }
      } else if (dataTask?.linkedType === "user") {
        try {
          const res = await axios.get("/api/users");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          setEditLinkedOptions([]);
        }
      } else {
        setEditLinkedOptions([]);
      }
    };
    fetchEditLinkedOptions();
  }, [dataTask?.linkedType]);

  // Handle input changes for Edit Task form
  const handleChangeDetail = (e) => {
    const { name, value } = e.target;
    setDataTask((prevTask) => ({
      ...prevTask,
      [name]: value,
      // Reset dependent fields if type changes
      ...(name === "assignedType" && { assignedTo: "" }),
      ...(name === "linkedType" && { linkedTo: "" }),
    }));
  };

  const handleUpdateStart = (task) => {
    setDataTask({ ...task });
    setEditAssignedOptions([]);
    setEditLinkedOptions([]);
  };

  // Handle form submission for updating the task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/contact-data/${dataTask._id}`,
        dataTask
      );

      const updatedTask = response.data.task;
      setData((prevTask) =>
        prevTask.map((task) =>
          task._id === dataTask._id ? response.data.data : task
        )
      );

      setDataTask(null);
      setEditAssignedOptions([]);
      setEditLinkedOptions([]);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Data Collection</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Data Collection
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <h2 className="text-xl font-semibold mb-4">New Data</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Task Title */}
                  <div>
                    <label className="block mb-1">Data Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newData.title}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>

                  {/* Linked To Type */}
                  <div>
                    <label className="block mb-1">Linked To Type</label>
                    <select
                      name="linkedType"
                      value={newData.linkedType}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Type</option>
                      {options.types.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Linked To */}
                  <div>
                    <label className="block mb-1">Linked To</label>
                    {newData.linkedType ? (
                      <select
                        name="linkedTo"
                        value={newData.linkedTo}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">
                          Select{" "}
                          {newData.linkedType.charAt(0).toUpperCase() +
                            newData.linkedType.slice(1)}
                        </option>
                        {Array.isArray(linkedOptions) &&
                        linkedOptions.length > 0 ? (
                          linkedOptions.map((option) => (
                            <option
                              key={option.id || option._id}
                              value={option.name || option.companyName}
                            >
                              {option.name ||
                                option.companyName }
                            </option>
                          ))
                        ) : (
                          <option disabled>No options available</option>
                        )}
                      </select>
                    ) : (
                      <select
                        disabled
                        className="w-full border px-3 py-2 rounded bg-gray-200"
                      >
                        <option>Select Type First</option>
                      </select>
                    )}
                  </div>

                  {/* Assigned Type */}
                  <div>
                    <label className="block mb-1">Assigned Type</label>
                    <select
                      name="assignedType"
                      value={newData.assignedType}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Type</option>
                      {users.types.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block mb-1">Assigned To</label>
                    {newData.assignedType ? (
                      <select
                        name="assignedTo"
                        value={newData.assignedTo}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">
                          Select{" "}
                          {newData.assignedType.charAt(0).toUpperCase() +
                            newData.assignedType.slice(1)}
                        </option>
                        {Array.isArray(assignedOptions) &&
                        assignedOptions.length > 0 ? (
                          assignedOptions.map((option) => (
                            <option
                              key={option.id || option._id}
                              value={option.firstName || option.lastName}
                            >
                              {option.firstName || option.lastName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No options available</option>
                        )}
                      </select>
                    ) : (
                      <select
                        disabled
                        className="w-full border px-3 py-2 rounded bg-gray-200"
                      >
                        <option>Select Type First</option>
                      </select>
                    )}
                  </div>

                  {/* contactPhase */}
                  <div>
                    <label className="block mb-1">Contact Phase</label>
                    <select
                      name="contactPhase"
                      value={newData.contactPhase}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="closurePhase">Closure Phase</option>
                      <option value="Client">Client</option>
                      <option value="lead">Lead</option>
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
                    Save Data 
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Linked To</th>
                  <th className="py-2 px-4 border-b">Assigned To</th>
                  <th className="py-2 px-4 border-b">ContactPhase</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.map((data) => (
                    <tr
                      key={data.id || data._id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="py-2 px-4 border-b">{data.title}</td>
                      {/* Linked To Display */}
                      <td className="py-2 px-4 border-b">
                        {data.linkedType
                          ? `${
                              data.linkedType.charAt(0).toUpperCase() +
                              data.linkedType.slice(1)
                            }: ${data.linkedToName || data.linkedTo}`
                          : data.linkedTo}
                      </td>
                      {/* Assigned To Display */}
                      <td className="py-2 px-4 border-b">
                        {data.assignedType
                          ? `${
                              data.assignedType.charAt(0).toUpperCase() +
                              data.assignedType.slice(1)
                            }: ${data.assignedToName || data.assignedTo}`
                          : data.assignedTo}
                      </td>

                      <td className="py-2 px-4 border-b">{data.contactPhase}</td>
                      <td className="py-2 px-4 border-b" data-label="Actions">
                        <button
                          className="mr-2 text-blue-500 hover:text-blue-700"
                          onClick={() => handleUpdateStart(task)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {dataTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 shadow-lg rounded-lg w-1/2 overflow-y-auto max-h-full">
                <h2 className="text-xl font-semibold mb-4">Data Details</h2>
                <form onSubmit={handleUpdateTask}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Title */}
                    <div>
                      <label className="block mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={dataTask?.title || ""}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      />
                    </div>

                    {/* Linked To Type */}
                    <div>
                      <label className="block mb-1">Linked To Type</label>
                      <select
                        name="linkedType"
                        value={dataTask?.linkedType || ""}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">Select Type</option>
                        {options.types.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Linked To */}
                    <div>
                      <label className="block mb-1">Linked To</label>
                      {dataTask.linkedType ? (
                        <select
                          name="linkedTo"
                          value={dataTask?.linkedTo || ""}
                          onChange={handleChangeDetail}
                          className="w-full border px-3 py-2 rounded"
                          required
                        >
                          <option value="">
                            Select {dataTask.linkedType}
                          </option>
                          {editLinkedOptions.length > 0 ? (
                            editLinkedOptions.map((option) => (
                              <option
                                key={option.id || option._id}
                                value={option.name || option.companyName}
                              >
                                {option.name ||
                                  option.companyName }
                              </option>
                            ))
                          ) : (
                            <option disabled>No options available</option>
                          )}
                        </select>
                      ) : (
                        <select
                          disabled
                          className="w-full border px-3 py-2 rounded bg-gray-200"
                        >
                          <option>Select Type First</option>
                        </select>
                      )}
                    </div>

                    {/* Assigned Type */}
                    <div>
                      <label className="block mb-1">Assigned Type</label>
                      <select
                        name="assignedType"
                        value={dataTask?.assignedType || ""}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">Select Type</option>
                        {users.types.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Assigned To */}
                    <div>
                      <label className="block mb-1">Assigned To</label>
                      {dataTask.assignedType ? (
                        <select
                          name="assignedTo"
                          value={dataTask?.assignedTo || ""}
                          onChange={handleChangeDetail}
                          className="w-full border px-3 py-2 rounded"
                          required
                        >
                          <option value="">
                            Select {dataTask.assignedType}
                          </option>
                          {editAssignedOptions.length > 0 ? (
                            editAssignedOptions.map((option) => (
                              <option
                                key={option.id || option._id}
                                value={option.firstName || option.lastName}
                              >
                                {option.firstName || option.lastName}
                              </option>
                            ))
                          ) : (
                            <option disabled>No options available</option>
                          )}
                        </select>
                      ) : (
                        <select
                          disabled
                          className="w-full border px-3 py-2 rounded bg-gray-200"
                        >
                          <option>Select Type First</option>
                        </select>
                      )}
                    </div>

                    {/* contactPhase */}
                    <div>
                      <label className="block mb-1">ContactPhase</label>
                      <select
                        name="contactPhase"
                        value={dataTask?.contactPhase || "normal"}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="closurePhase'">Closure Phase'</option>
                      <option value="client">Client</option>
                      <option value="lead">Lead</option>
                      </select>
                    </div>

                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseDetail}
                      className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Update 
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

export default DataCollection;
