"use server";
import Answer from "@/database/models/AnswerSchema.model";
import { connectDB } from "../db";
import { CreateAnswerParams } from "./shared.types";
import Question from "@/database/models/QuestionSchema.model";
import { revalidatePath } from "next/cache";

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
