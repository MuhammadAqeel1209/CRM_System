import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
      required: true,
    },
    productBrandName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "is invalid"], // Basic email validation
    },
  mainContactPersonId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contacts', 
    required: true, 
  },

    website: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Partners =
  mongoose.models.Partners || mongoose.model("Partners", PartnerSchema);

export default Partners;
