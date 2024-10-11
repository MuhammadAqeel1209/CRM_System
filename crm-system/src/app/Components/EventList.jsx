import React from 'react';

const EventList = ({ events }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Scheduled Events</h2>
      <ul className="bg-white rounded-lg shadow-md p-4">
        {events.length > 0 ? (
          events.map((event, index) => (
            <li key={index} className="border-b py-2">
              <strong>{event.title}</strong> - {event.date} at {event.time}
            </li>
          ))
        ) : (
          <li>No events scheduled</li>
        )}
      </ul>
    </div>
  );
};

export default EventList;
