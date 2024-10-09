import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const PartnerCard = ({ partner }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <FaBuilding className="text-blue-500 mr-4" size={30} />
      <div>
        <p className="text-lg font-semibold">{partner.name}</p>
        <p className="text-sm text-gray-500">Brand: {partner.productBrand}</p>
        <p className="text-sm text-gray-500">Contact: {partner.mainContact}</p>
        <p className="text-sm text-gray-500">Email: {partner.email}</p>
      </div>
    </div>
  );
};

export default PartnerCard;
