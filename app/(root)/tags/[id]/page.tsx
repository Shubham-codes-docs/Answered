import React from "react";
import NotFound from "@/components/shared/NotFound";
import Card from "@/components/shared/cards/QuestionCard";
import { getQuestionsByTagId } from "@/lib/actions/tags.action";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const res = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <div>
      <>
        <h1 className="h1-bold text-dark100_light900">{res.tagTitle}</h1>
        <div className="mt-11 w-full">
          <LocalSearch
            placeHolder="Search for Questions related to the tags here"
            route="/"
            iconPosition="left"
            otherClasses="flex-1"
            imgSrc="/assets/icons/search.svg"
          />
        </div>
        <div className="mt-10 flex w-full flex-col gap-6">
          {res.questions.length !== 0 ? (
            res.questions.map((question: any) => (
              <Card
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <NotFound
              title="There&rsquo;s no question relevant to the tag to show"
              description={`Save Questions relevant to you and do not miss updates on them.`}
              link="/ask-question"
              linkText="Ask a question"
            />
          )}
        </div>
      </>
    </div>
  );
};

export default Page;
