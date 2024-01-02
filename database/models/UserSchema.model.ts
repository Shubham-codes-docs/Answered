import { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  userName: string;
  email: string;
  password?: string;
  bio?: string;
  location?: string;
  websiteLink?: string;
  reputation?: number;
  image: string;
  saved: Schema.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  websiteLink: {
    type: String,
    required: false,
  },
  reputation: {
    type: Number,
    required: false,
    default: 0,
  },
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
