"use server";

import Question from "@/database/models/QuestionSchema.model";
import User from "@/database/models/UserSchema.model";
import Tag from "@/database/models/TagSchema.model";
import { connectDB } from "../db";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectDB();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

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
        { $setOnInsert: { name: tag }, $push: { question: newQuestion._id } },
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
