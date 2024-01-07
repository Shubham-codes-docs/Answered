"use server";
import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/QuestionSchema.model";

// get all users
export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectDB();

    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserById = async (params: GetUserByIdParams) => {
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

export const createUser = async (userParams: CreateUserParams) => {
  try {
    connectDB();

    const newUser = new User(userParams);
    await newUser.save();
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectDB();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) throw new Error("User not found");

    // const userQuestionIds = await Question.find({author:user._id}).distinct("_id");

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
