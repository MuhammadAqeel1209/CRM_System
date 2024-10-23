"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";

const Page = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState({});
  const [visibleMaterials, setVisibleMaterials] = useState({}); // State for material visibility

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    const userId = localStorage.getItem("userId");
    const parsedId = JSON.parse(userId);
    setUserId(parsedId.value);
    setUserRole(parsedRole.value);
  }, []);

  const fetchCourseEnroll = () => {
    axios
      .get("/api/enroll")
      .then((response) => {
        setEnrolledCourses(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCourse = () => {
    axios
      .get("/api/course")
      .then((response) => {
        setCourses(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUser = () => {
    axios
      .get("/api/users")
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCourseEnroll();
    fetchCourse();
    fetchUser();
  }, []);

  const getUserCourseDetails = (user) => {
    const enrolledCourse = enrolledCourses.find(
      (course) => course.userId === user._id
    );
    const courseDetails = enrolledCourse
      ? courses.find((course) => course._id === enrolledCourse.courseId)
      : null;

    return {
      courseTitle: courseDetails ? courseDetails.title : "N/A",
      courseMaterial: courseDetails ? courseDetails.material : [],
    };
  };

  const startReading = async (linkId) => {
    const readTime = 10; // Total read time in minutes
    const userProgress = progress[linkId] || 0;

    if (userProgress < readTime) {
      const updatedProgress = { ...progress, [linkId]: userProgress + 1 };
      setProgress(updatedProgress);

      try {
        await axios.post("/api/progessReport", { userId, linkId, time: 1 });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  const toggleMaterialVisibility = (userId) => {
    setVisibleMaterials((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">User Courses</h1>
            <Button />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.length > 0 ? (
              users
                .filter((user) => {
                  const isUserEnrolled = enrolledCourses.some(
                    (course) => course.userId === user._id
                  );
                  return isUserEnrolled; // Show only enrolled users
                })
                .map((user) => {
                  const { courseTitle, courseMaterial } =
                    getUserCourseDetails(user);
                  const enrolledCourse = enrolledCourses.find(
                    (course) => course.userId === user._id
                  );

                  const isAuthorizedUser =
                    userRole === "Admin" || user._id === userId;

                  return (
                    isAuthorizedUser && (
                      <div
                        key={user._id}
                        className="bg-white p-4 border rounded-lg shadow-md transition-transform transform hover:scale-105"
                      >
                        <h3 className="font-semibold text-lg">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p>Phone: {user.phoneNumber}</p>
                        <p>Email: {user.email}</p>
                        <p>Course Title: {courseTitle}</p>

                        <button
                          onClick={() => toggleMaterialVisibility(user._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                        >
                          {visibleMaterials[user._id] ? "Hide Materials" : "Show Materials"}
                        </button>

                        {visibleMaterials[user._id] && (
                          <div className="mt-2">
                            <p>Course Materials:</p>
                            {courseMaterial.map((item, index) => (
                              <div key={index}>
                                <a
                                  href={item}
                                  target="_blank"
                                  className="text-blue-500 underline font-bold block max-w-full break-words"
                                  rel="noopener noreferrer"
                                >
                                  {item}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        <p>
                          Progress: {progress[enrolledCourse.courseId] || 0} / 10
                        </p>
                        <button
                          onClick={() => startReading(enrolledCourse.courseId)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                        >
                          Start Reading
                        </button>
                      </div>
                    )
                  );
                })
            ) : (
              <p className="text-gray-500 col-span-3">No users found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
