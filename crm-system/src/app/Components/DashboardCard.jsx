import React from 'react';

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
