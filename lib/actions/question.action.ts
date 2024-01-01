"use server";

import { connectDB } from "../db";

export const createQuestion = async (question: any) => {
  try {
    connectDB();
  } catch (err) {
    console.log(err);
  }
};
