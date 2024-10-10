"use client";
import { useEffect, useState } from 'react';
import { InlineWidget } from "react-calendly";
import EventList from '../Components/EventList';

const page = () => {
  const [events, setEvents] = useState([]);
  const fetchCalendlyEvents = async () => {
    try {
      const response = await fetch("https://calendly.com/app/contacts/user/me", {
        headers: {
          "Authorization": `Bearer ${process.env.CALENDLY_API_KEY}`, // Make sure to set your Calendly API key in your environment variables
          "Content-Type": "application/json",
        },
      });
      console.log("res\t",response)
      const data = await response.json();
      // Assuming the event data structure has a name and start time you want to use
      const fetchedEvents = data.collection.map(event => ({
        name: event.name,
        date: event.start_time, // Adjust the date format if necessary
      }));
      console.log("==============")
      console.log(fetchedEvents)
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchCalendlyEvents();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar Overview</h1>
        {/* EventList Component */}
        <EventList events={events} />
      </div>

      <div className="calendar-widget">
        <InlineWidget url="https://calendly.com/muhammadaqeelshakeel1209/30min" />
      </div>
    </div>

  )
}

export default page
