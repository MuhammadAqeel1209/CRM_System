import React from 'react';
import { FaMedal } from 'react-icons/fa';

const RankingCard = ({ advisor }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <FaMedal className={`text-${advisor.id === 1 ? 'yellow-500' : advisor.id === 2 ? 'gray-400' : 'bronze-500'} mr-4`} size={30} />
      <div>
        <p className="text-lg font-semibold">{advisor.name}</p>
        <p className="text-sm text-gray-500">Points: {advisor.points}</p>
        <p className="text-sm text-gray-500">Level: {advisor.level}</p>
      </div>
    </div>
  );
};

export default RankingCard;
