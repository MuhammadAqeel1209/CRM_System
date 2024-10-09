// models/Contract.js
import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true, // Assuming policy numbers are unique
    },
    companyName: {
      type: String,
      required: true,
    },
    contactType: {
      type: String,
      enum: ['New', 'Renewal', 'Upgrade'], // Example enums
      required: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Cancelled'], // Example enums
      required: true,
    },
    totalPremium: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    lastUpdate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Contracts = mongoose.models.Contracts || mongoose.model('Contracts', ContractSchema);

export default Contracts;
