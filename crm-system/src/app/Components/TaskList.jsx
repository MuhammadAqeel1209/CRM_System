import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks?id=${id}`);
      onTaskDeleted(id);
    } catch (error) {
      console.error(error);
    }
  };

  // Implement handleEdit as needed
  const handleEdit = (task) => {
    // You can implement a modal or inline editing
    alert('Edit functionality not implemented yet.');
  };

  return (
    <table className="min-w-full bg-white shadow rounded-lg">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Title</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Linked To</th>
          <th className="py-2 px-4 border-b">Assigned To</th>
          <th className="py-2 px-4 border-b">Priority</th>
          <th className="py-2 px-4 border-b">Due Date</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{task.title}</td>
            <td className="py-2 px-4 border-b">{task.status}</td>
            <td className="py-2 px-4 border-b">{task.linkedTo}</td>
            <td className="py-2 px-4 border-b">{task.assignedTo}</td>
            <td className="py-2 px-4 border-b">{task.priority}</td>
            <td className="py-2 px-4 border-b">{task.dueDate}</td>
            <td className="py-2 px-4 border-b flex space-x-2">
              <FaEdit className="text-green-500 cursor-pointer" onClick={() => handleEdit(task)} />
              <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(task.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
