import mongoose from "mongoose";

const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI

    try {
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.log(error);
    }
};
export default connectDatabase;