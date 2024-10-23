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
  console.log(courseData, "courseData");
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
      objectives: "",
      material: "",
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
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-4">
            <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
              <h1 className="text-2xl font-semibold">Courses</h1>
              <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
                <Button />
                {role === "Admin" && (
                  <button
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 md:mt-0 transition duration-300"
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
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                      name="description"
                      value={courseData.description}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Level</label>
                    <select
                      name="levels"
                      value={courseData.levels}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Material Links</label>
                    {courseData.material.length > 0 &&
                      courseData?.material?.map((link, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={link}
                            onChange={(e) =>
                              handleMaterialChange(index, e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded mr-2"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
                    >
                      <FaPlus className="mr-1" />
                      Add Material Link
                    </button>
                  </div>

                  <div>
                    <label className="block mb-1">Objective</label>
                    {courseData.objectives.length > 0 &&
                      courseData.objectives.map((text, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={text}
                            onChange={(e) =>
                              handleObjectiveChange(index, e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded mr-2"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
                    >
                      <FaPlus className="mr-1" />
                      Add Objective
                    </button>
                  </div>

                  <div>
                    <label className="block mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 space-x-10">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white shadow rounded-lg p-4 relative w-full md:w-[65%] lg:w-[90%] flex flex-col space-y-2"
                  >
                    {role === "Admin" && (
                      <div className="flex flex-col md:flex-row justify-between space-x-4 items-center mb-4">
                        {" "}
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                          aria-label="Delete course"
                        >
                          <FaTrash size={20} />
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="absolute top-4 right-12 text-blue-500 hover:text-blue-700"
                          aria-label="Edit course"
                        >
                          <FaEdit size={20} />
                        </button>
                      </div>
                    )}
                    <h2 className="text-lg font-semibold mb-2">
                      {course.title}
                    </h2>
                    <p className="mb-2">{course.description}</p>
                    <p className="mb-2">
                      <strong>Duration:</strong> {course.duration} Week
                    </p>
                    <p className="mb-2">
                      <strong>Level:</strong> {course.levels}
                    </p>
                    <p className="mb-2">
                    <strong> Objectives </strong>
                      {course.objectives.map((item, index) => (
                        <>
                          <span
                            key={index}
                            href={course.objectives}
                            className="text-blue-500 font-bold"
                          >
                            {item}
                          </span>
                          <br />
                        </>
                      ))}
                    </p>
                    <p className="mb-2">
                    <strong> Materials </strong>
                      {course.material.map((item, index) => (
                        <>
                          <a
                            key={index}
                            href={course.material}
                            target="_blank"
                            className="text-blue-500 underline font-bold"
                          >
                            {item}
                          </a>
                          <br />
                        </>
                      ))}
                    </p>
                    <p className="mb-2">
                      <strong>Price:</strong> ${course.price}
                    </p>
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Enroll
                    </button>
                  </div>
                ))
              ) : (
                <p>No courses available.</p>
              )}
            </div>
            <ToastContainer />
            {error && (
              <div className="mt-4 text-red-500">
                <p>{error}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Courses;
