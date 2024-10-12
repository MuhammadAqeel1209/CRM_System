import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true, 
    },
    companyName: {
      type: String,
      required: true,
    },
    contractType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    applicationStatus: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

const Contracts = mongoose.models.Contracts || mongoose.model('Contracts', ContractSchema);

export default Contracts;
