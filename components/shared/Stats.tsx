import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  imgUrl: string;
}

const StatsCard = ({ title, value, imgUrl }: StatsCardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} width={40} height={50} alt={title} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">
          {formatNumber(value)}
        </p>
        <p className="body-medium text-dark400_light700 mt-2">{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ totalQuestions, totalAnswers }: StatsProps) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700 mt-2">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700 mt-2">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={0}
          title="Gold badges"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={0}
          title="Silver badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={0}
          title="Bronze badges"
        />
      </div>
    </div>
  );
};

export default Stats;
