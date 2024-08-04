import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const mongoUser = await getUserById({ userId: clerkId });

  const questionDetails = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          userId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(questionDetails)}
        />
      </div>
    </>
  );
};

export default page;
