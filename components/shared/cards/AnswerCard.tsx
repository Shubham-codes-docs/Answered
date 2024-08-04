import Link from "next/link";

import Metrics from "../Metrics";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";

interface AnswerCardProps {
  clerkId?: string;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    image: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: AnswerCardProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <Link
      href={`/questions/${question._id}/#${_id}`}
      className="card-wrapper mb-4 rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metrics
          imgUrl={author.image}
          alt="user avatar"
          value={author.name}
          text={` • asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyle="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metrics
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
            value={formatNumber(upvotes)}
            text=" Votes"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Link>
  );
};

export default AnswerCard;
