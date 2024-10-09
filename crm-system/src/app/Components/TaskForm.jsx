import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Open',
    linkedTo: '',
    assignedTo: '',
    priority: 'Low',
    dueDate: '',
    createdBy: 'Admin',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', formData);
      onTaskAdded(response.data);
      setFormData({
        title: '',
        status: 'Open',
        linkedTo: '',
        assignedTo: '',
        priority: 'Low',
        dueDate: '',
        createdBy: 'Admin',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="bg-white shadow rounded-lg p-4 mb-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
          className="border p-2 rounded"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input
          type="text"
          name="linkedTo"
          value={formData.linkedTo}
          onChange={handleChange}
          placeholder="Linked To"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          placeholder="Assigned To"
          className="border p-2 rounded"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
