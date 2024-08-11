import * as z from "zod";

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must contain atleast 5 characters.",
    })
    .max(130, {
      message: "Title must contain less than 130 characters.",
    }),
  description: z.string().min(20, {
    message: "Description must contain atleast 20 characters.",
  }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Please select atleast one tag." })
        .max(15, { message: "Please select less than 15 tags." })
    )
    .min(1)
    .max(2, { message: "Please select atmost 3 tags." }),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100, {
    message: "Answer must contain atleast 100 characters.",
  }),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Name must contain atleast 5 characters.",
    })
    .max(50, {
      message: "Name must contain less than 50 characters.",
    }),
  userName: z
    .string()
    .min(5, {
      message: "Username must contain atleast 5 characters.",
    })
    .max(50, {
      message: "Username must contain less than 50 characters.",
    }),
  bio: z.string().max(150, {
    message: "Bio must contain less than 150 characters.",
  }),
  location: z.string().max(50, {
    message: "Location must contain less than 50 characters.",
  }),
  websiteLink: z.union([z.string().url(), z.literal("")]),
});
