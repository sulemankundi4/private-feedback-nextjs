import mongoose from "mongoose";

let isConnected = false;

export const dbConnection = async () => {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (connection.connections[0].readyState) isConnected = true;
    console.log("Connected to the database");
  } catch (e) {
    console.log("Error connecting to the database", e);
    process.exit(1);
  }
};
