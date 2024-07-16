import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import RenderTag from "../RenderTag";
import Link from "next/link";
import Metrics from "../Metrics";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: Array<{ _id: string; name: string; ObjectId?: string }>;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  upvotes: Array<Object>;
  views: number;
  answers: Array<Object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  return (
    <Card className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <CardContent>
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimestamp(createdAt)}
            </span>
            <Link href={`/questions/${_id}`}>
              <p className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </p>
            </Link>
          </div>
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metrics
          imgUrl={author.image}
          alt="user"
          text={` - asked ${getTimestamp(createdAt)}`}
          value={author.name}
          href={`/profile/${author._id}`}
          isAuthor
          textStyle="body-medium text-dark400_light800"
        />
        <Metrics
          imgUrl={"/assets/icons/like.svg"}
          alt="Upvotes"
          text="Votes"
          value={formatNumber(upvotes?.length | 0)}
          textStyle="small-medium text-dark400_light800"
        />
        <Metrics
          imgUrl={"/assets/icons/message.svg"}
          alt="Answers"
          text="Answers"
          value={formatNumber(answers.length)}
          textStyle="small-medium text-dark400_light800"
        />
        <Metrics
          imgUrl={"/assets/icons/eye.svg"}
          alt="Views"
          text="Views"
          value={formatNumber(views)}
          textStyle="small-medium text-dark400_light800"
        />
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
