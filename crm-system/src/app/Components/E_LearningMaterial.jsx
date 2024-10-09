import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const LearningMaterialCard = ({ material, completed }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{material.title}</h3>
        {completed ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-400" />}
      </div>
      <p className="text-sm text-gray-500 mt-2">{material.description}</p>
      <a href={material.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-500 hover:underline">
        Access Material
      </a>
    </div>
  );
};

export default LearningMaterialCard;
