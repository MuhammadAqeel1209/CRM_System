"use client";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
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
    objectives: [],
    material: [],
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setRole(parsedRole.value);
  }, []);

  useEffect(() => {
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
          setCourses(response.data.data);
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
      objectives: [],
      material: [],
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
    setShowForm(true);
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

  const handleMaterialChange = (index, value) => {
    const newMaterial = [...courseData.material];
    newMaterial[index] = value;
    setCourseData({ ...courseData, material: newMaterial });
  };

  const handleAddMaterial = () => {
    setCourseData({ ...courseData, material: [...courseData.material, ""] });
  };

  const handleRemoveMaterial = (index) => {
    const newMaterial = courseData.material.filter((_, i) => i !== index);
    setCourseData({ ...courseData, material: newMaterial });
  };

  const handleObjectiveChange = (index, value) => {
    const newObjective = [...courseData.objectives];
    newObjective[index] = value;
    setCourseData({ ...courseData, objectives: newObjective });
  };

  const handleAddObjective = () => {
    setCourseData({
      ...courseData,
      objectives: [...courseData.objectives, ""],
    });
  };

  const handleRemoveObjective = (index) => {
    const newObjective = courseData.objectives.filter((_, i) => i !== index);
    setCourseData({ ...courseData, objectives: newObjective });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-4">
            <div className="flex items-center justify-between w-full mb-4">
              <h1 className="text-2xl font-semibold">Courses</h1>
              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 items-center">
                <Button />
                {role === "Admin" && (
                  <button
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                  >
                    <FaPlus className="mr-2" />
                    Add Courses
                  </button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="bg-white p-6 shadow rounded-lg mb-4 relative w-full lg:w-1/2">
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
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={courseData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded p-2"
                      rows={4}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Duration (in weeks)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Levels
                    </label>
                    <input
                      type="text"
                      name="levels"
                      value={courseData.levels}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Objectives
                    </label>
                    {courseData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => handleObjectiveChange(index, e.target.value)}
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(index)}
                          className="ml-2 text-red-500"
                          aria-label="Remove objective"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Add Objective
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Materials
                    </label>
                    {courseData.material.map((mat, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={mat}
                          onChange={(e) => handleMaterialChange(index, e.target.value)}
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="ml-2 text-red-500"
                          aria-label="Remove material"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Add Material
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEditing ? "Update Course" : "Add Course"}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Loading courses...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white p-4 shadow rounded-lg"
                  >
                    <h2 className="text-lg font-semibold">{course.title}</h2>
                    <p className="text-gray-700">{course.description}</p>
                    <p className="text-sm text-gray-600">Duration: {course.duration} weeks</p>
                    <p className="text-sm text-gray-600">Levels: {course.levels}</p>
                    <p className="text-sm text-gray-600">Price: ${course.price}</p>
                    <div className="flex justify-between mt-4">
                      {role === "Admin" && (
                        <>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="flex items-center text-blue-500 hover:underline"
                          >
                            <FaEdit className="mr-1" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="flex items-center text-red-500 hover:underline"
                          >
                            <FaTrash className="mr-1" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                      >
                        <FaBookOpen className="inline mr-2" />
                        Enroll
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses available.</p>
              )}
            </div>
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Courses;
