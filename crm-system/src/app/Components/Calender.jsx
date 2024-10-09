import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CRMCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Calendar</h2>
      <Calendar onChange={setDate} value={date} />
      {/* You can enhance this by displaying events on selected date */}
    </div>
  );
};

export default CRMCalendar;
