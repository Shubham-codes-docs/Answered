"use server";

import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/models/TagSchema.model";

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectDB();

    const tags = await Tag.find({});

    return { tags };
  } catch (err) {
    console.log(err);
    return { tags: [] };
  }
};

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    connectDB();
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      tags: [
        {
          _id: "1",
          name: "tag1",
        },
        {
          _id: "2",
          name: "tag2",
        },
        {
          _id: "3",
          name: "tag3",
        },
      ],
    };
  } catch (err) {
    console.log(err);
    return { tags: [] };
  }
};
