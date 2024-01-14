import { Schema, Document, models, model } from "mongoose";

interface IAnswer extends Document {
  question: Schema.Types.ObjectId;
  description: string;
  upVotes: Schema.Types.ObjectId[];
  downVotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
