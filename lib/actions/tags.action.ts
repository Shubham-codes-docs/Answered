"use server";

import User from "@/database/models/UserSchema.model";
import { connectDB } from "../db";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/models/TagSchema.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/models/QuestionSchema.model";

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectDB();

    // get params
    const { searchQuery, filter, page = 1, pageSize = 1 } = params;

    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    // define a mongoose filter query
    const query: FilterQuery<typeof Tag> = {};

    // if searchQuery exists make a query
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    // switch statement to sort questions based on filter
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const tags = await Tag.find(query)
      .skip(skipValue)
      .limit(pageSize)
      .sort(sortOptions);

    // calculate the total number of documents and check if there are more pages
    const totalQuestions = await Tag.countDocuments(query);

    const isNext = totalQuestions > skipValue + tags.length;

    return { tags, isNext };
  } catch (err) {
    console.log(err);
    return { tags: [], isNext: false };
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

    const { tagId, page = 1, pageSize = 1, searchQuery } = params;

    // calculate the number of documents to skip
    const skipValue = (page - 1) * pageSize;

    // create search mongoose query
    const query: FilterQuery<typeof Question> = {};

    // if searchQuery exists make a query
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: "Question",
      match: query,
      options: {
        limit: pageSize,
        skip: skipValue,
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

    // calculate the total number of documents and check if there are more pages
    const totalTagQuestions = await Tag.findById(tagId, "questions");

    const isNext =
      totalTagQuestions.questions.length > skipValue + tag.questions.length;

    if (!tag) throw new Error("User not found");

    return { tagTitle: tag.name, questions: tag.questions, isNext };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get popular tags

export const getPopularTags = async () => {
  try {
    connectDB();

    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          totalQuestions: { $size: "$questions" },
        },
      },
      {
        $sort: { totalQuestions: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return popularTags;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
