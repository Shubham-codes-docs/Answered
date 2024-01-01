"use server";

import Question from "@/database/models/QuestionSchema.model";
import { connectDB } from "../db";
import Tag from "@/database/models/TagSchema.model";

export async function createQuestion(params: any) {
  try {
    connectDB();
    console.log("connected");
    const { title, description, tags, author } = params;
    console.log(title);

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
  } catch (err) {
    console.log(err);
  }
}
