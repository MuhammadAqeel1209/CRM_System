'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'open',
    linkedTo: '',
    assignedTo: '',
    priority: 'normal',
    dueDate: '',
    createdBy: '',
  });
  const [selectedTask, setSelectedTask] = useState(null); // State to manage the selected task

  // Sample options for linked to and assigned to fields
  const options = {
    linkedTo: ['contact', 'contract', 'partner'],
    assignedTo: ['contact', 'contract', 'partner'], 
  };

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks'); // Update endpoint as needed
        setTasks(response.data.tasks); // Adjust according to your response structure
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', newTask); // Ensure the endpoint is correct
      setTasks([...tasks, response.data.task]); // Update the task list
      setNewTask({
        title: '',
        status: 'open',
        linkedTo: '',
        assignedTo: '',
        priority: 'normal',
        dueDate: '',
        createdBy: '',
      });
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewTask({
      title: '',
      status: 'open',
      linkedTo: '',
      assignedTo: '',
      priority: 'normal',
      dueDate: '',
      createdBy: '',
    });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Set the selected task for detailed view
  };

  const handleCloseDetail = () => {
    setSelectedTask(null); // Close the detailed view
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/tasks/${selectedTask.id}`, selectedTask); // Ensure the endpoint is correct
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? response.data.task : task
      );
      setTasks(updatedTasks);
      setSelectedTask(null); // Close the detailed view after updating
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChangeDetail = (e) => {
    const { name, value } = e.target;
    setSelectedTask({ ...selectedTask, [name]: value }); // Update the selected task details
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
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close form"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">New Task</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div>
                    <label className="block mb-1">Linked To</label>
                    <select
                      name="linkedTo"
                      value={newTask.linkedTo}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select</option>
                      {options.linkedTo.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Assigned To</label>
                    <select
                      name="assignedTo"
                      value={newTask.assignedTo}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select</option>
                      {options.assignedTo.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <div>
                    <label className="block mb-1">Created By</label>
                    <input
                      type="text"
                      name="createdBy"
                      value={newTask.createdBy}
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
                  <th className="py-2 px-4 border-b">Task ID</th>
                  <th className="py-2 px-4 border-b">Task Title</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Assigned To</th>
                  <th className="py-2 px-4 border-b">Priority</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border-b">{task.id}</td>
                    <td className="py-2 px-4 border-b">{task.title}</td>
                    <td className="py-2 px-4 border-b">{task.status}</td>
                    <td className="py-2 px-4 border-b">{task.assignedTo}</td>
                    <td className="py-2 px-4 border-b">{task.priority}</td>
                    <td className="py-2 px-4 border-b">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 shadow-lg rounded-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>
                <form onSubmit={handleUpdateTask}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1">Task Title</label>
                      <input
                        type="text"
                        name="title"
                        value={selectedTask.title}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Status</label>
                      <select
                        name="status"
                        value={selectedTask.status}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Linked To</label>
                      <select
                        name="linkedTo"
                        value={selectedTask.linkedTo}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="">Select</option>
                        {options.linkedTo.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Assigned To</label>
                      <select
                        name="assignedTo"
                        value={selectedTask.assignedTo}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="">Select</option>
                        {options.assignedTo.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Priority</label>
                      <select
                        name="priority"
                        value={selectedTask.priority}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={selectedTask.dueDate}
                        onChange={handleChangeDetail}
                        className="w-full border px-3 py-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Created By</label>
                      <input
                        type="text"
                        name="createdBy"
                        value={selectedTask.createdBy}
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
