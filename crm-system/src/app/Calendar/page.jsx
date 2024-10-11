"use client";
import { useEffect, useState } from 'react';
import { InlineWidget } from "react-calendly";
import EventList from '../Components/EventList';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const Page = () => {
  const [events, setEvents] = useState([]);

  const fetchCalendlyEvents = async () => {
    try {
      const response = await fetch("https://calendly.com/api/v1/users/me/event_types", {
        headers: {
          "Authorization": `Bearer ${process.env.CALENDLY_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const fetchedEvents = data.collection.map(event => ({
        name: event.name,
        date: event.start_time,
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };
  

  useEffect(() => {
    fetchCalendlyEvents();
  }, []);

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
            {/* EventList Component */}
            <EventList events={events} />
            <div className="calendar-widget">
              <InlineWidget url="https://calendly.com/muhammadaqeelshakeel1209/30min" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
