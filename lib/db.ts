import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGOOSE_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (isConnected) {
    return console.log("Using existing connection");
  }

  try {
    await mongoose.connect(process.env.MONGOOSE_URI, {
      dbName: "Answered",
    });
    isConnected = true;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};
