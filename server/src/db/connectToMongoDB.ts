// import mongoose from "mongoose";

// const connectToMongoDB = async (): Promise<void> => {
//   try {
//     const mongoUri = process.env.MONGO_DB_URI;
//     if (!mongoUri) {
//       throw new Error("MONGO_DB_URI is not defined in environment variables");
//     }
//     await mongoose.connect(mongoUri);
//     console.log("Connected to MongoDB");
//   } catch (error: any) {
//     console.log("Error connecting to MongoDB", error.message);
//   }
// };

// export default connectToMongoDB;

import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  const mongoDbUri = process.env.MONGO_DB_URI;
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST || "127.0.0.1";
  const port = process.env.MONGO_PORT || "27017";
  const db = process.env.MONGO_DB || "chatapp";

  const encodedPassword = password ? encodeURIComponent(password) : "";
  const authUri = `mongodb://${username}:${encodedPassword}@${host}:${port}/${db}?authSource=admin`;
  const simpleUri = mongoDbUri || `mongodb://${host}:${port}/${db}`;

  try {
    console.log(
      `\x1b[34m[Mongo]\x1b[0m Attempting connection to ${host}:${port}...`,
    );

    // Try Authenticated first if credentials exist
    if (username && password) {
      try {
        await mongoose.connect(authUri, { serverSelectionTimeoutMS: 2000 });
        console.log("✅ \x1b[32m[Mongo]\x1b[0m Connected (Authenticated)");
        return;
      } catch (authError) {
        console.warn(
          "⚠️ \x1b[33m[Mongo]\x1b[0m Auth failed, trying without credentials...",
        );
      }
    }

    // Try Simple connection
    await mongoose.connect(simpleUri, { serverSelectionTimeoutMS: 2000 });
    console.log("✅ \x1b[32m[Mongo]\x1b[0m Connected (No Auth)");
  } catch (error: any) {
    console.error(
      "❌ \x1b[31m[Mongo]\x1b[0m Connection failed:",
      error.message,
    );
    // 🚀 Production (GKE): Throw error so server.ts can exit and K8s can restart the pod
    if (process.env.NODE_ENV === "production") throw error;
  }
};

export default connectToMongoDB;
