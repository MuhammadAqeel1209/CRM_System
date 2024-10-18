"use client";
import { useEffect, useState } from 'react';
import { InlineWidget } from "react-calendly";
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const Page = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Calendar Overview</h1>
            </div>
            <div className="calendar-widget">
              <InlineWidget url="https://calendly.com/presleytinasankul/30min" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
