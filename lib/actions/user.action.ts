"use server";
import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";

export const getUserById = async (params: any) => {
  try {
    connectDB();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
