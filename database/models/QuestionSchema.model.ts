import { Schema, Document, models, model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upVotes: Schema.Types.ObjectId[];
  downVotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  upVotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downVotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
