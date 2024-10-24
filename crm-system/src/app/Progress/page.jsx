'use client';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "../Components/Button";
import Sidebar from "../Components/Sidebar";

const Page = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [visibleMaterials, setVisibleMaterials] = useState({});
  const [visitedLinks, setVisitedLinks] = useState({}); // Track visited links
  const timerRef = useRef(null); // Reference for the timer

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

  const getUserCourses = (user) => {
    const userCourses = enrolledCourses
      .filter((course) => course.userId === user._id)
      .map((enrolledCourse) =>
        courses.find((course) => course._id === enrolledCourse.courseId)
      )
      .filter(Boolean);

    return userCourses.length > 0 ? userCourses : [{ title: "N/A", material: [] }];
  };

  const toggleMaterialVisibility = (userId, courseIndex) => {
    setVisibleMaterials((prevState) => ({
      ...prevState,
      [userId]: {
        ...prevState[userId],
        [courseIndex]: !prevState[userId]?.[courseIndex],
      },
    }));
  };

  const handleLinkClick = (userId, courseIndex, materialIndex) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setVisitedLinks((prevState) => ({
        ...prevState,
        [userId]: {
          ...prevState[userId],
          [courseIndex]: {
            ...prevState[userId]?.[courseIndex],
            [materialIndex]: true,
          },
        },
      }));
    }, 600000); // 10 minutes in milliseconds
  };

  const getVisitedPercentage = (userId, courseIndex, totalMaterials) => {
    const visitedLinksForUser = visitedLinks[userId]?.[courseIndex] || {};
    const visitedCount = Object.values(visitedLinksForUser).filter(Boolean)
      .length;
    return totalMaterials > 0
      ? ((visitedCount / totalMaterials) * 100).toFixed(2)
      : 0;
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
                  return enrolledCourses.some(
                    (course) => course.userId === user._id
                  );
                })
                .map((user) => {
                  const userCourses = getUserCourses(user);
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

                        {userCourses.map((course, courseIndex) => (
                          <div key={courseIndex} className="mt-4">
                            {course.material.length > 0 && ( // Only show material if it exists
                              <>
                                <p>Course Title: {course.title}</p>

                                {/* Render Show/Hide Materials button only if the logged-in user is the enrolled user */}
                                {enrolledCourses.some(
                                  (enrolledCourse) =>
                                    enrolledCourse.userId === userId &&
                                    enrolledCourse.courseId === course._id
                                ) && (
                                  <button
                                    onClick={() =>
                                      toggleMaterialVisibility(user._id, courseIndex)
                                    }
                                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                                  >
                                    {visibleMaterials[user._id]?.[courseIndex]
                                      ? "Hide Materials"
                                      : "Show Materials"}
                                  </button>
                                )}

                                {/* Conditionally render the course materials */}
                                {visibleMaterials[user._id]?.[courseIndex] && (
                                  <div className="mt-2">
                                    <p>Course Materials:</p>
                                    {course.material.map((item, materialIndex) => (
                                      <div key={materialIndex}>
                                        <a
                                          href={item}
                                          target="_blank"
                                          className="text-blue-500 underline font-bold block max-w-full break-words"
                                          rel="noopener noreferrer"
                                          onClick={() =>
                                            handleLinkClick(user._id, courseIndex, materialIndex)
                                          }
                                        >
                                          {item}
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Always show the progress percentage */}
                                <p className="mt-2">
                                  Progress Percentage:{" "}
                                  {getVisitedPercentage(user._id, courseIndex, course.material.length)}%
                                </p>
                              </>
                            )}
                          </div>
                        ))}
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
