"use client";
import React from "react";
import Navbar from "@/app/Components/Navbar";
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
} from "react-icons/fa";

const Dashborad = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState([]);
  const router = useRouter()

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>

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

          {/* Ranking and Competition Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Ranking & Competition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Monthly Points"
                value={350}
                icon={<FaTrophy size={30} className="text-yellow-600" />}
              />
              <DashboardCard
                title="Career Level"
                value="Senior Advisor"
                icon={<FaUsers size={30} className="text-blue-600" />}
              />
              <DashboardCard
                title="Compensation"
                value="$5000"
                icon={<FaChartLine size={30} className="text-green-600" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Points awarded based on closures and linked to career levels. Compensation is tied to achieved career levels and points.
            </p>
          </div> */}

          {/* Partner Overview Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Partner Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Partner Name"
                value="ABC Corp"
                icon={<FaBriefcase size={30} className="text-blue-500" />}
              />
              <DashboardCard
                title="Product Brand"
                value="Brand X"
                icon={<FaBriefcase size={30} className="text-green-500" />}
              />
              <DashboardCard
                title="Main Contact"
                value="John Doe"
                icon={<FaBriefcase size={30} className="text-yellow-500" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Click on a partner for more details.
            </p>
          </div> */}

          {/* Task Management Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Task Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Task ID"
                value="001"
                icon={<FaTasks size={30} className="text-blue-500" />}
              />
              <DashboardCard
                title="Task Title"
                value="Follow up with client"
                icon={<FaTasks size={30} className="text-green-500" />}
              />
              <DashboardCard
                title="Status"
                value="In Progress"
                icon={<FaTasks size={30} className="text-yellow-500" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Click on a task for more details and editing options.
            </p>
          </div> */}

          {/* Client App Overview Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Client App Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Advisor Info"
                value="Jane Smith"
                icon={<FaUsers size={30} className="text-blue-500" />}
              />
              <DashboardCard
                title="Contracts"
                value="5 Active"
                icon={<FaFileContract size={30} className="text-green-500" />}
              />
              <DashboardCard
                title="Contact Advisor"
                value=""
                icon={<FaPhone size={30} className="text-yellow-500" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Notifications and updates about contracts are available.
            </p>
          </div> */}

          {/* Calendar Overview Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2"> Calendar Overview </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/Calendar">
                {" "}
                <DashboardCard
                  title="Meetings Scheduled"
                  value=""
                  icon={<FaCalendar size={30} className="text-green-500" />}
                />
              </Link>
            </div>
          </div>

          {/* E-Learning Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">E-Learning Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Training Modules"
                value="5 Available"
                icon={<FaBookOpen size={30} className="text-blue-500" />}
              />
              <DashboardCard
                title="Upload Materials"
                value=""
                icon={<FaBookOpen size={30} className="text-green-500" />}
              />
              <DashboardCard
                title="Employee Progress"
                value="On Track"
                icon={<FaBookOpen size={30} className="text-yellow-500" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Monitor employee training progress and access materials.
            </p>
          </div> */}

          {/* Data Collection Section */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Contact Phase"
                value="Lead"
                icon={<FaDatabase size={30} className="text-blue-500" />}
              />
              <DashboardCard
                title="Linked To"
                value="Contract #001"
                icon={<FaDatabase size={30} className="text-green-500" />}
              />
              <DashboardCard
                title="Assigned To"
                value="John Doe"
                icon={<FaDatabase size={30} className="text-yellow-500" />}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Modify data collection using the consulting analysis tool.
            </p>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default Dashborad;
