"use server";

import Question from "@/database/models/QuestionSchema.model";
import User from "@/database/models/UserSchema.model";
import Tag from "@/database/models/TagSchema.model";
import { connectDB } from "../db";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/models/AnswerSchema.model";
import Interactions from "@/database/models/InteractionSchema.model";
import { FilterQuery } from "mongoose";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectDB();

    const { searchQuery, filter } = params;

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
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

    return { questions };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    connectDB();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name image",
      });
    if (!question) throw new Error("Question not found");

    return { question };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectDB();
    const { title, description, tags, author, path } = params;

    const newQuestion = await Question.create({
      title,
      description,
      author,
    });

    const tagsArray = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: newQuestion._id } },
        { upsert: true, new: true }
      );
      tagsArray.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(newQuestion._id, {
      $push: { tags: { $each: tagsArray } },
    });
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upVotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { upVotes: userId },
        $pull: { downVotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upVotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error("Question not found");

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = {
        $pull: { downVotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $push: { downVotes: userId },
        $pull: { upVotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downVotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) throw new Error("Question not found");

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

// delete a question
export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    connectDB();

    const { questionId, path } = params;

    await Question.deleteOne({
      _id: questionId,
    });

    await Answer.deleteMany({
      question: questionId,
    });

    await Interactions.deleteMany({
      question: questionId,
    });

    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);

    return { message: "Question deleted successfully" };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// edit a question
export const editQuestion = async (params: EditQuestionParams) => {
  try {
    connectDB();

    const { questionId, title, description, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) throw new Error("Question not found");

    question.title = title;
    question.description = description;

    await question.save();

    revalidatePath(path);

    return { message: "Question deleted successfully" };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get hot questions
export const getHotQuestions = async () => {
  try {
    connectDB();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upVotes: -1 })
      .limit(5);

    return { hotQuestions };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
