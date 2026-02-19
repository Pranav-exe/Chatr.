import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_DB_URI;
    if (!mongoUri) {
      throw new Error("MONGO_DB_URI is not defined in environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;
