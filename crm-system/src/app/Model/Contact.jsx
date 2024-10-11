import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String, // Keeping as String to accommodate various formats
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'], // Basic email validation
    },
    type: {
      type: String,
      required: true,
    },
    leadSource: {
      type: String,

      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contacts = mongoose.models.Contacts || mongoose.model('Contacts', ContactSchema);

export default Contacts;
