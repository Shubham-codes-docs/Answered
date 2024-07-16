"use server";

import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
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

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    connectDB();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: "Question",
      match: searchQuery
        ? { title: { $regex: searchQuery, options: "i" } }
        : {},
      options: {
        limit: pageSize,
        skip: pageSize * (page - 1),
        sort: { createdAt: -1 },
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

    if (!tag) throw new Error("User not found");

    return { tagTitle: tag.name, questions: tag.questions };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
