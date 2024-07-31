"use server";
import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/models/QuestionSchema.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/models/TagSchema.model";
import Answer from "@/database/models/AnswerSchema.model";

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

// save questions for a user
export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    connectDB();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const ifQuestionSaved = user.saved.includes(questionId);

    if (ifQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);

    return { message: "Question saved" };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get saved questions for a user
export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectDB();

    const { clerkId, page = 1, pageSize = 20, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        limit: pageSize,
        skip: pageSize * (page - 1),
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name image",
        },
      ],
    });

    if (!user) throw new Error("User not found");

    return { savedQuestions: user.saved };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    connectDB();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId }).select(
      "_id clerkId name image createdAt location bio websiteLink"
    );

    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({
      author: user._id,
    });

    return { user, totalQuestions, totalAnswers };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get user questions
export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name image")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    return { totalQuestions, userQuestions };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get user answers
export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    connectDB();

    const { userId, page = 1, pageSize = 1 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate("author", "_id clerkId name image")
      .populate("question", "_id title")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    return { totalAnswers, answers: userAnswers };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
