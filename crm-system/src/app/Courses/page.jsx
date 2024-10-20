"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTimes, FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    duration: "",
    levels: "",
    objectives: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setRole(parsedRole.value); // Set the user role state
  }, []);

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const id = localStorage.getItem("userId");
    const parsedId = JSON.parse(id);
    setUserId(parsedId.value); 
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/course");
        if (response.status === 200) {
          setCourses(response.data.data || []);
        } else {
          throw new Error("Unexpected response from the server.");
        }
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = isEditing
        ? await axios.put(`/api/course/${courseData._id}`, courseData)
        : await axios.post("/api/course", courseData);

      if (response.data.success && response.data.data) {
        setCourses((prevCourses) => {
          return isEditing
            ? prevCourses.map((course) =>
                course._id === response.data.data._id
                  ? response.data.data
                  : course
              )
            : [...prevCourses, response.data.data];
        });
        resetForm();
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      setError(
        `Failed to ${
          isEditing ? "update" : "add"
        } course. Please check your input and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseData({
      title: "",
      description: "",
      duration: "",
      levels: "",
      objectives: "",
      price: "",
    });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleDeleteCourse = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setLoading(true);
      try {
        await axios.delete(`/api/course/${id}`);
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== id)
        );
      } catch {
        setError("Failed to delete course. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditCourse = (course) => {
    setIsEditing(true);
    setCourseData(course);
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await axios.post("/api/enroll", { userId, courseId });
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch {
      toast.error("Failed to enroll. Please try again.");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Courses</h1>
              {role === '"Admin"' && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <FaPlus className="mr-2" />
                  Add Course
                </button>
              )}
            </div>

            {showForm && (
              <div className="bg-white p-6 shadow rounded-lg mb-4 relative">
                <button
                  onClick={resetForm}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close form"
                >
                  <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Edit Course" : "New Course"}
                </h2>
                <form onSubmit={handleSubmit}>
                  {/* Form Fields */}
                  {Object.keys(courseData).map((key) => (
                    <div key={key}>
                      <label className="block mb-1 capitalize">{key}</label>
                      {key === "description" || key === "objectives" ? (
                        <textarea
                          name={key}
                          value={courseData[key]}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                          required
                        />
                      ) : key === "levels" ? (
                        <select
                          name={key}
                          value={courseData[key]}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                          required
                        >
                          <option value="">Select level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      ) : (
                        <input
                          type={key === "price" ? "number" : "text"}
                          name={key}
                          value={courseData[key]}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                          required
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
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
                        ? "Saving..."
                        : `${isEditing ? "Update" : "Save"} Course`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              {loading ? (
                <p>Loading courses...</p>
              ) : (
                <table className="min-w-full bg-white shadow rounded-lg">
                  <thead>
                    <tr>
                      {[
                        "Title",
                        "Description",
                        "Duration",
                        "Level",
                        "Objectives",
                        "Price",
                      ].map((header) => (
                        <th key={header} className="py-2 px-4 border-b">
                          {header}
                        </th>
                      ))}
                      {role === '"Admin"' && (
                        <th className="py-2 px-4 border-b">Actions</th>
                      )}
                      <th className="py-2 px-4 border-b">Enroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td className="py-2 px-4 border-b">{course.title}</td>
                        <td className="py-2 px-4 border-b">
                          {course.description}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {course.duration} week{" "}
                        </td>
                        <td className="py-2 px-4 border-b">{course.levels}</td>
                        <td className="py-2 px-4 border-b">
                          {course.objectives}
                        </td>
                        <td className="py-2 px-4 border-b">${course.price}</td>
                        {role === "Admin" && (
                          <td className="py-2 px-4 border-b ">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="text-blue-500"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-500"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        )}
                        <td className="py-2 px-4 border-b ">
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className="text-green-500"
                          >
                            <FaBookOpen />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <ToastContainer />
          </main>
        </div>
      </div>
    </>
  );
};

export default Courses;
