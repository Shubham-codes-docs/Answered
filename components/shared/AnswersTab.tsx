import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "./cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const AnswersTab = async ({
  searchParams,
  userId,
  clerkId,
}: AnswersTabProps) => {
  const res = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {res?.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upVotes.length}
          createdAt={answer.createdAt}
          clerkId={clerkId}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={res.isNext}
        />
      </div>
    </>
  );
};

export default AnswersTab;
