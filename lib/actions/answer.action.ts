"use server";
import Answer from "@/database/models/AnswerSchema.model";
import { connectDB } from "../db";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/models/QuestionSchema.model";
import { revalidatePath } from "next/cache";
import Interactions from "@/database/models/InteractionSchema.model";

export const getAllAnswers = async (params: GetAnswersParams) => {
  const { questionId, filter } = params;
  try {
    connectDB();

    let sortOptions = {};

    // switch statement to sort questions based on filter
    switch (filter) {
      case "highestupvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestupvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name image",
      })
      .sort(sortOptions);
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

// delete an answer
export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectDB();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) throw new Error("Answer not found");

    await Answer.deleteOne({
      _id: answerId,
    });

    await Interactions.deleteMany({
      answer: answerId,
    });

    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    revalidatePath(path);

    return { message: "Question deleted successfully" };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
