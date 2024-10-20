"use client";
import React from "react";
import Button from "@/app/Components/Button";
import Sidebar from "@/app/Components/Sidebar";
import DashboardCard from "@/app/Components/DashboardCard";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../Utils/Auth";
import { useLayoutEffect } from "react";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaFileContract,
  FaTasks,
  FaHandshake,
  FaChartLine,
  FaCalendar,
  FaPhone,
  FaClipboardList,
  FaTrophy,
  FaBriefcase,
  FaBookOpen,
  FaDatabase,
  FaBook,
} from "react-icons/fa";

const Dashborad = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState([]);
  const [partners, setPartners] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]);
  const [userRole, setUserRole] = useState();
  const router = useRouter();


  useLayoutEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    axios
      .get("/api/stats")
      .then((res) => {
        setStats(res.data.statistics);
      })
      .catch(() => {
        setError("Error fetching data");
      });
  }, []);

  useEffect(() => {
    // Retrieve user role from localStorage when the component mounts
    const role = localStorage.getItem("userRole");
    const parsedRole = JSON.parse(role);
    setUserRole(parsedRole.value); // Set the user role state
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get("/api/partners");
        if (response.data.success && Array.isArray(response.data.data)) {
          // Ensure each partner has a string _id
          const transformedPartners = response.data.data.map((partner) => ({
            ...partner,
            _id: partner._id.toString(),
          }));
          setPartners(transformedPartners);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Failed to fetch partners. Please try again later.");
      }
    };
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

    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/course");
        if (response.status === 200) {
          setCourses(response.data.data || []);
        } else {
          throw new Error("Unexpected response from the server.");
        }
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
      }
    };
    const fetchCollection = async () => {
      try {
        const response = await axios.get("/api/collections");
        if (response.data.success && Array.isArray(response.data.data)) {
          setData(response.data.data);
        }
      } catch {
        console.log("Failed to fetch collection. Please try again later.");
      }
    };

    fetchCollection();
    fetchCourses();
    fetchTasks();
    fetchPartners();
  }, []);

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        <main className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            <Button/>
          </div>

          {/* Key Performance Indicators Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Contracts"
              value={stats["contracts"]}
              icon={<FaUsers size={30} className="text-blue-500" />}
            />
            <DashboardCard
              title="Contacts"
              value={stats["contacts"]}
              icon={<FaFileContract size={30} className="text-green-500" />}
            />
            <DashboardCard
              title="Tasks"
              value={stats["tasks"]}
              icon={<FaTasks size={30} className="text-blue-500" />}
            />
            <DashboardCard
              title="Partners"
              value={stats["partners"]}
              icon={<FaHandshake size={30} className="text-yellow-500" />}
            />
            <DashboardCard
              title="Users"
              value={stats["users"]}
              icon={<FaUsers size={30} className="text-orange-500" />}
            />
            <DashboardCard
              title="KPI Score"
              value="85%"
              icon={<FaChartLine size={30} className="text-red-500" />}
            />
            {/* New Dashboard Cards for Leads and Monthly Closures */}
            <DashboardCard
              title="Leads"
              value={45}
              icon={<FaClipboardList size={30} className="text-purple-500" />}
            />
            <DashboardCard
              title="Monthly Closures"
              value={10}
              icon={<FaChartLine size={30} className="text-orange-500" />}
            />
          </div>

          {/* Partner Overview Section */}
          {userRole === "Admin" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Partner Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((partner) => (
                  <DashboardCard
                    key={partner._id}
                    title={`Name: ${partner.name}`}
                    value={`Brand Name: ${partner.productBrandName}`}
                    icon={<FaBriefcase size={30} className="text-blue-500" />}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <Link href={"/Partner"}>
                  Click on a partner for more details.
                </Link>
              </p>
            </div>
          )}

          {/* Calendar Overview Section */}
          {(userRole === "Admin" || userRole === "Advisor") && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Calendar Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/Calendar">
                  <DashboardCard
                    title="Meetings Scheduled"
                    value="" // You can replace this with actual data if available
                    icon={<FaCalendar size={30} className="text-green-500" />}
                  />
                </Link>
              </div>
            </div>
          )}

          {/* Task Management Section */}
          {userRole === "Admin" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Task Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <DashboardCard
                    key={task._id}
                    title={`Title: ${task.title}`}
                    value={`Status: ${task.status}`}
                    icon={<FaTasks size={30} className="text-blue-500" />}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <Link href={"/Task"}>Click on a tasks for more details.</Link>
              </p>
            </div>
          )}
          {/* E-Learning Section */}
          {userRole === "Admin" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">E-Learning Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <DashboardCard
                    key={course._id}
                    title={
                      <span className="font-bold">Title: {course.title}</span>
                    }
                    value={` Description:
                        ${course.description.substring(0, 15)}
                        ${course.description.length > 15 ? "..." : ""}`}
                    icon={<FaBook size={30} className="text-blue-500" />}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <Link href={"/Courses"}>
                  Click on a course for more details.
                </Link>
              </p>
            </div>
          )}

          {/* Data Collection Section */}
          {userRole === "Admin" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">
                Data Collection Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((dat) => (
                  <DashboardCard
                    key={dat._id}
                    title={
                      <span className="font-bold">Title: {dat.title}</span>
                    }
                    value={` Contact Phase:
                        ${dat.contactPhase}`}
                    icon={<FaDatabase size={30} className="text-blue-500" />}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <Link href={"/CollectionData"}>
                  Click on a collectionData for more details.
                </Link>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashborad;
