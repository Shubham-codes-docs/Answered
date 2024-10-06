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

    // get search query
    const { searchQuery, filter, page = 1, pageSize = 1 } = params;

    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    // define searchQuery
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { userName: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    // get sort query
    let sortOption = {};

    // add switch case for filter
    switch (filter) {
      case "new_users":
        sortOption = { createdAt: -1 };
        break;
      case "old_users":
        sortOption = { createdAt: 1 };
        break;
      case "top_contributors":
        sortOption = { reputation: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const users = await User.find(query)
      .limit(pageSize)
      .skip(skipValue)
      .sort(sortOption);

    // calculate the total number of documents and check if there are more pages
    const totalQuestions = await User.countDocuments(query);

    const isNext = totalQuestions > skipValue + users.length;

    return { users, isNext };
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

    const { clerkId, page = 1, pageSize = 10, searchQuery, filter } = params;

    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    // switch statement to sort questions based on filter
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        limit: pageSize,
        skip: skipValue,
        sort: sortOptions,
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

    // calculate the total number of documents and check if there are more pages
    const totalSavedQuestions = await User.findOne({ clerkId }, "saved");

    const isNext =
      totalSavedQuestions.saved.length > skipValue + user.saved.length;

    if (!user) throw new Error("User not found");

    return { savedQuestions: user.saved, isNext };
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
      "_id clerkId name image createdAt location bio websiteLink userName"
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

    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name image")
      .skip(skipValue)
      .limit(pageSize);

    // calculate the total number of documents and check if there are more pages
    const isNext = totalQuestions > skipValue + userQuestions.length;

    return { totalQuestions, userQuestions, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get user answers
export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    connectDB();

    const { userId, page = 1, pageSize = 10 } = params;
    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate("author", "_id clerkId name image")
      .populate("question", "_id title")
      .skip(skipValue)
      .limit(pageSize);

    // calculate the total number of documents and check if there are more pages
    const isNext = totalAnswers > skipValue + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
