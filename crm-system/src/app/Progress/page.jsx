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
      courseMaterail: courseDetails ? courseDetails.material : "N/A",
    };
  };

  // New function to handle reading progress
  const startReading = async (linkId) => {
    const readTime = 10; // Total read time in minutes
    const userProgress = progress[linkId] || 0;

    if (userProgress < readTime) {
      // Increment progress
      const updatedProgress = { ...progress, [linkId]: userProgress + 1 };
      setProgress(updatedProgress);

      try {
        await axios.post("/api/progessReport", { userId, linkId, time: 1 });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-6 bg-gray-100">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold">User Courses </h1>
            <Button />
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    "First Name",
                    "Last Name",
                    "Phone Number",
                    "Email",
                    "Course Title",
                    "Course Materials",
                    "Progress",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="py-3 px-4 border-b text-left text-gray-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users
                    .filter((user) => {
                      const isUserEnrolled = enrolledCourses.some(
                        (course) => course.userId === user._id
                      );
                      return isUserEnrolled; // Show only enrolled users
                    })
                    .map((user) => {
                      const { courseTitle, courseMaterail } =
                        getUserCourseDetails(user);
                      const enrolledCourse = enrolledCourses.find(
                        (course) => course.userId === user._id
                      );

                      // Conditional rendering based on user role
                      const isAuthorizedUser =
                        userRole === "Admin" || user._id === userId;

                      return (
                        isAuthorizedUser && (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50 transition duration-200"
                          >
                            <td className="py-2 px-4 border-b text-center">
                              {user.firstName}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {user.lastName}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {user.phoneNumber}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {user.email}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {courseTitle}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {courseMaterail.map((item, index) => (
                                <>
                                  <a
                                    key={index}
                                    href={item}
                                    target="_blank"
                                    className="text-blue-500 underline font-bold"
                                  >
                                    {item}
                                  </a>
                                  <br />
                                </>
                              ))}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {progress[enrolledCourse.courseId] || 0} / 10
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              <button
                                onClick={() =>
                                  startReading(enrolledCourse.courseId)
                                }
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                              >
                                Start Reading
                              </button>
                            </td>
                          </tr>
                        )
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
