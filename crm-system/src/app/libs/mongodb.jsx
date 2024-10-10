import mongoose from "mongoose";

export const connectDB = async () => { // Exporting connectDB as a named export
  console.log(process.env.MONGODB_URI)
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.log("MongoDB Not Connected...");
    console.log(error);
  }
};
