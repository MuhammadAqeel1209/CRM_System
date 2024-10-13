import mongoose from "mongoose";

const AdvisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String, // Keeping as String to accommodate various formats
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "is invalid"], // Basic email validation
    },
  },
  {
    timestamps: true,
  }
);

const Advisors =
  mongoose.models.Advisors || mongoose.model("Advisors", AdvisorSchema);

export default Advisors;
