import Metrics from "@/components/shared/Metrics";
import ParseHtml from "@/components/shared/ParseHtml";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface QuestionProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: QuestionProps) => {
  const res = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${res.question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={res.question.author.image}
              alt="avatar"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {res.question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">voting</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {res.question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metrics
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          text={"Asked"}
          value={` - asked ${getTimestamp(res.question.createdAt)}`}
          textStyle="smal-medium text-dark400_light800"
        />
        <Metrics
          imgUrl={"/assets/icons/message.svg"}
          alt="Answers"
          text="Answers"
          value={formatNumber(res.question.answers.length)}
          textStyle="small-medium text-dark400_light800"
        />
        <Metrics
          imgUrl={"/assets/icons/eye.svg"}
          alt="Views"
          text="Views"
          value={formatNumber(res.question.views)}
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <ParseHtml data={res.question.description} />
    </>
  );
};

export default page;
