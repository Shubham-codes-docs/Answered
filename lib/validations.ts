import * as z from "zod";

export const questionSchema = z.object({
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
