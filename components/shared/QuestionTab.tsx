import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "./cards/QuestionCard";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const res = await getUserQuestions({ userId, page: 1 });

  return (
    <>
      {res?.userQuestions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          clerkId={clerkId}
          createdAt={question.createdAt}
          answers={question.answers}
        />
      ))}
    </>
  );
};

export default QuestionTab;
