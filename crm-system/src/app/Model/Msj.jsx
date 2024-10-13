import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    advisorName:
         {
      type: String,
      required: true,
    },
    message: {
      type: String, // Keeping as String to accommodate various formats
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", MessageSchema);

export default Messages;
