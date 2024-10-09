import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const ClientPolicyCard = ({ policy }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col">
      <p className="text-lg font-semibold">Policy Number: {policy.policyNumber}</p>
      <p className="text-sm text-gray-500">Company: {policy.company}</p>
      <p className="text-sm text-gray-500">Status: {policy.status}</p>
      <p className="text-sm text-gray-500">Expiry Date: {policy.expiryDate}</p>
      <button className="mt-4 flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <FaEnvelope className="mr-2" />
        Contact Advisor
      </button>
    </div>
  );
};

export default ClientPolicyCard;
