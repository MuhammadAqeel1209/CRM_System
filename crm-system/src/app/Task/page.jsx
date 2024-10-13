"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    status: "open",
    linkedType: "",
    linkedTo: "",
    assignedType: "",
    assignedTo: "",
    priority: "normal",
    dueDate: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [linkedOptions, setLinkedOptions] = useState([]);
  const [editAssignedOptions, setEditAssignedOptions] = useState([]);
  const [editLinkedOptions, setEditLinkedOptions] = useState([]);

  // Sample options for linked to and assigned to fields
  const options = {
    types: ["contact", "contract", "partner"],
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks");
        if (response.data.success && Array.isArray(response.data.data)) {
          setTasks(response.data.data);
        }
      } catch {
        console.log("Failed to fetch contracts. Please try again later.");
      }
    };

    fetchTasks();
  }, []);

  // Fetch Assigned Options based on type for Add Task form
  useEffect(() => {
    const fetchAssignedOptions = async () => {
      if (newTask.assignedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setAssignedOptions(res.data.data); // Adjust based on your API response
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setAssignedOptions([]);
        }
      } else if (newTask.assignedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setAssignedOptions([]);
        }
      } else if (newTask.assignedType === "partner") {
        try {
          const res = await axios.get("/api/partners");
          setAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching partners:", error);
          setAssignedOptions([]);
        }
      } else {
        setAssignedOptions([]);
      }
    };
    fetchAssignedOptions();
  }, [newTask.assignedType]);

  // Fetch Linked Options based on type for Add Task form
  useEffect(() => {
    const fetchLinkedOptions = async () => {
      if (newTask.linkedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setLinkedOptions(res.data.data); // Adjust based on your API response
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setLinkedOptions([]);
        }
      } else if (newTask.linkedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setLinkedOptions([]);
        }
      } else if (newTask.linkedType === "partner") {
        try {
          const res = await axios.get("/api/partners");
          setLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching partners:", error);
          setLinkedOptions([]);
        }
      } else {
        setLinkedOptions([]);
      }
    };
    fetchLinkedOptions();
  }, [newTask.linkedType]);

  // Handle input changes for Add Task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
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
      const response = await axios.post("/api/tasks", newTask); // Ensure the endpoint is correct
      setTasks([...tasks, response.data.data]); // Update the task list
      setNewTask({
        title: "",
        status: "open",
        linkedType: "",
        linkedTo: "",
        assignedType: "",
        assignedTo: "",
        priority: "normal",
        dueDate: "",
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
    setNewTask({
      title: "",
      status: "open",
      linkedType: "",
      linkedTo: "",
      assignedType: "",
      assignedTo: "",
      priority: "normal",
      dueDate: "",
    });
    setAssignedOptions([]);
    setLinkedOptions([]);
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Are you sure to delete this task??")) return;
    axios
      .delete(`/api/tasks/${id}`)
      .then((res) => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Handle closing the detail view
  const handleCloseDetail = () => {
    setSelectedTask(null); // Close the detailed view
    setEditAssignedOptions([]);
    setEditLinkedOptions([]);
  };

  // Fetch Assigned Options based on type for Edit Task form
  useEffect(() => {
    const fetchEditAssignedOptions = async () => {
      if (selectedTask?.assignedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setEditAssignedOptions([]);
        }
      } else if (selectedTask?.assignedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setEditAssignedOptions([]);
        }
      } else if (selectedTask?.assignedType === "partner") {
        try {
          const res = await axios.get("/api/partners");
          setEditAssignedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching partners:", error);
          setEditAssignedOptions([]);
        }
      } else {
        setEditAssignedOptions([]);
      }
    };
    fetchEditAssignedOptions();
  }, [selectedTask?.assignedType]);

  // Fetch Linked Options based on type for Edit Task form
  useEffect(() => {
    const fetchEditLinkedOptions = async () => {
      if (selectedTask?.linkedType === "contact") {
        try {
          const res = await axios.get("/api/contacts");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setEditLinkedOptions([]);
        }
      } else if (selectedTask?.linkedType === "contract") {
        try {
          const res = await axios.get("/api/contracts");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching contracts:", error);
          setEditLinkedOptions([]);
        }
      } else if (selectedTask?.linkedType === "partner") {
        try {
          const res = await axios.get("/api/partners");
          setEditLinkedOptions(res.data.data);
        } catch (error) {
          console.error("Error fetching partners:", error);
          setEditLinkedOptions([]);
        }
      } else {
        setEditLinkedOptions([]);
      }
    };
    fetchEditLinkedOptions();
  }, [selectedTask?.linkedType]);

  // Handle input changes for Edit Task form
  const handleChangeDetail = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
      // Reset dependent fields if type changes
      ...(name === "assignedType" && { assignedTo: "" }),
      ...(name === "linkedType" && { linkedTo: "" }),
    }));
  };

  const handleUpdateStart = (task) => {
    setSelectedTask({ ...task });
    setEditAssignedOptions([]);
    setEditLinkedOptions([]);
  };

  // Handle form submission for updating the task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/tasks/${selectedTask._id}`,
        selectedTask
      );

      const updatedTask = response.data.task;
      setTasks((prevTask) =>
        prevTask.map((task) =>
          task._id === selectedTask._id ? response.data.data : task
        )
      );

      setSelectedTask(null); 
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
            <h1 className="text-2xl font-semibold">Task Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-2" />
              Add Task
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
              <h2 className="text-xl font-semibold mb-4">New Task</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Task Title */}
                  <div>
                    <label className="block mb-1">Task Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-1">Status</label>
                    <select
                      name="status"
                      value={newTask.status}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="open">Open</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Linked To Type */}
                  <div>
                    <label className="block mb-1">Linked To Type</label>
                    <select
                      name="linkedType"
                      value={newTask.linkedType}
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
                    {newTask.linkedType ? (
                      <select
                        name="linkedTo"
                        value={newTask.linkedTo}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">
                          Select{" "}
                          {newTask.linkedType.charAt(0).toUpperCase() +
                            newTask.linkedType.slice(1)}
                        </option>
                        {Array.isArray(linkedOptions) &&
                        linkedOptions.length > 0 ? (
                          linkedOptions.map((option) => (
                            <option
                              key={option.id || option._id}
                              value={option.name || option.companyName}
                            >
                              {option.name ||
                                option.companyName ||
                                option.title}
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
                      value={newTask.assignedType}
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

                  {/* Assigned To */}
                  <div>
                    <label className="block mb-1">Assigned To</label>
                    {newTask.assignedType ? (
                      <select
                        name="assignedTo"
                        value={newTask.assignedTo}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">
                          Select{" "}
                          {newTask.assignedType.charAt(0).toUpperCase() +
                            newTask.assignedType.slice(1)}
                        </option>
                        {Array.isArray(assignedOptions) &&
                        assignedOptions.length > 0 ? (
                          assignedOptions.map((option) => (
                            <option
                              key={option.id || option._id}
                              value={option.name || option.companyName}
                            >
                              {option.name ||
                                option.companyName ||
                                option.title}
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

                  {/* Priority */}
                  <div>
                    <label className="block mb-1">Priority</label>
                    <select
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
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
                    Save Task
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Task Title</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Linked To</th>
                  <th className="py-2 px-4 border-b">Assigned To</th>
                  <th className="py-2 px-4 border-b">Priority</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tasks) &&
                  tasks.map((task) => (
                    <tr
                      key={task.id || task._id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="py-2 px-4 border-b">{task.title}</td>
                      <td className="py-2 px-4 border-b">{task.status}</td>
                      {/* Linked To Display */}
                      <td className="py-2 px-4 border-b">
                        {task.linkedType
                          ? `${
                              task.linkedType.charAt(0).toUpperCase() +
                              task.linkedType.slice(1)
                            }: ${task.linkedToName || task.linkedTo}`
                          : task.linkedTo}
                      </td>
                      {/* Assigned To Display */}
                      <td className="py-2 px-4 border-b">
                        {task.assignedType
                          ? `${
                              task.assignedType.charAt(0).toUpperCase() +
                              task.assignedType.slice(1)
                            }: ${task.assignedToName || task.assignedTo}`
                          : task.assignedTo}
                      </td>

                      <td className="py-2 px-4 border-b">{task.priority}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(task.dueDate).toLocaleDateString("en-US")}
                      </td>
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

          {selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 shadow-lg rounded-lg w-1/2 overflow-y-auto max-h-full">
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>
                <form onSubmit={handleUpdateTask}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Task Title */}
                    <div>
                      <label className="block mb-1">Task Title</label>
                      <input
                        type="text"
                        name="title"
                        value={selectedTask?.title || ""}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block mb-1">Status</label>
                      <select
                        name="status"
                        value={selectedTask?.status || "open"}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Linked To Type */}
                    <div>
                      <label className="block mb-1">Linked To Type</label>
                      <select
                        name="linkedType"
                        value={selectedTask?.linkedType || ""}
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
                      {selectedTask.linkedType ? (
                        <select
                          name="linkedTo"
                          value={selectedTask?.linkedTo || ""}
                          onChange={handleChangeDetail}
                          className="w-full border px-3 py-2 rounded"
                          required
                        >
                          <option value="">
                            Select {selectedTask.linkedType}
                          </option>
                          {editLinkedOptions.length > 0 ? (
                            editLinkedOptions.map((option) => (
                              <option
                                key={option.id || option._id}
                                value={option.name || option.companyName}
                              >
                                {option.name ||
                                  option.companyName ||
                                  option.title}
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
                        value={selectedTask?.assignedType || ""}
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

                    {/* Assigned To */}
                    <div>
                      <label className="block mb-1">Assigned To</label>
                      {selectedTask.assignedType ? (
                        <select
                          name="assignedTo"
                          value={selectedTask?.assignedTo || ""}
                          onChange={handleChangeDetail}
                          className="w-full border px-3 py-2 rounded"
                          required
                        >
                          <option value="">
                            Select {selectedTask.assignedType}
                          </option>
                          {editAssignedOptions.length > 0 ? (
                            editAssignedOptions.map((option) => (
                              <option
                                key={option.id || option._id}
                                value={option.name || option.companyName}
                              >
                                {option.name || option.companyName}
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

                    {/* Priority */}
                    <div>
                      <label className="block mb-1">Priority</label>
                      <select
                        name="priority"
                        value={selectedTask?.priority || "normal"}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block mb-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={selectedTask?.dueDate || ""}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      />
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
                      Update Task
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

export default TaskManagement;
