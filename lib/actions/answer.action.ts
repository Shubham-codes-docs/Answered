"use server";
import Answer from "@/database/models/AnswerSchema.model";
import { connectDB } from "../db";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/models/QuestionSchema.model";
import { revalidatePath } from "next/cache";

export const getAllAnswers = async (params: GetAnswersParams) => {
  const { questionId } = params;
  try {
    connectDB();
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name image",
      })
      .sort({ createdAt: -1 });
    return { answers };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectDB();
    const { description, author, question, path } = params;
    const answer = await Answer.create({ description, author, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    revalidatePath(path);
    return answer;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const upVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectDB();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
};

// downvote answer
export const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectDB();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
};
