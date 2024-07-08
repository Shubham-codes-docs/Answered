"use server";

import Question from "@/database/models/QuestionSchema.model";
import { connectDB } from "../db";
import { ViewQuestionParams } from "./shared.types";
import Interactions from "@/database/models/InteractionSchema.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    // connect to the database
    await connectDB();

    const { questionId, userId } = params;

    // update view count of the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interactions.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteraction) {
        return console.log("User has already viewed this question");
      }

      // create a new interaction
      const interaction = new Interactions({
        user: userId,
        question: questionId,
        action: "view",
      });

      await interaction.save();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
