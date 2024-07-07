import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/Filters";
import { getAllAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHtml from "./ParseHtml";
import Votes from "./Votes";

interface AllAnswersProps {
  questionId: string;
  authorId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}

const AllAnswers = async ({
  questionId,
  authorId,
  totalAnswers,
  page,
  filter,
}: AllAnswersProps) => {
  const res = await getAllAnswers({
    questionId,
    page,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filterOptions={AnswerFilters} />
      </div>
      {res.answers.map((answer) => {
        return (
          <article key={answer._id} className="mt-8">
            <div className="light-border border-b py-10">
              <div className="flex items-center justify-between">
                <div className="mb-8 flex basis-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                  <Link
                    href={`/profile/${answer.author.clerkId}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                  >
                    <Image
                      src={answer.author.image}
                      alt="avatar"
                      width={22}
                      height={22}
                      className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <p className="text-dark300_light700 body-semibold">
                        {answer.author.name}
                      </p>
                      <p className="small-regular text-dark400_light500 ml-0.5 mt-0.5 line-clamp-1">
                        answered {getTimestamp(answer.createdAt)}{" "}
                      </p>
                    </div>
                  </Link>
                  <div className="flex justify-end">
                    <Votes
                      type="Answer"
                      itemId={JSON.stringify(answer._id)}
                      userId={JSON.stringify(authorId)}
                      upvotes={answer.upVotes.length}
                      hasUpVoted={answer.upVotes.includes(authorId)}
                      downvotes={answer.downVotes.length}
                      hasDownVoted={answer.downVotes.includes(authorId)}
                    />
                  </div>
                </div>
              </div>
              <ParseHtml data={answer.description} />
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AllAnswers;
