import { Schema, Document, models, model } from "mongoose";

interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  action: string;
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },

  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],

  action: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Interactions =
  models.Interactions || model<IInteraction>("Interactions", InteractionSchema);

export default Interactions;
