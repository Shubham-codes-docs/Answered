import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const HOT_NETWORK = [
  {
    id: 1,
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  {
    id: 2,
    title: "How can an airconditioning machine exist?",
  },
  {
    id: 3,
    title: "Interrogated every time crossing UK Border as citizen",
  },
  {
    id: 4,
    title: "Low digit addition generator",
  },
  {
    id: 5,
    title: "What is an example of 3 numbers that do not make up a vector?",
  },
];

const POPULAR_TAGS = [
  {
    _id: "3",
    name: "Javascript",
    totalQuestions: 20152,
  },
  {
    _id: "1",
    name: "Next.JS",
    totalQuestions: 18493,
  },
  {
    _id: "2",
    name: "React.js",
    totalQuestions: 16269,
  },

  {
    _id: "4",
    name: "Node.js",
    totalQuestions: 15121,
  },
  {
    _id: "5",
    name: "Python",
    totalQuestions: 14431,
  },
  {
    _id: "6",
    name: "Microsoft Azure",
    totalQuestions: 9429,
  },
  {
    _id: "7",
    name: "PostgreSql",
    totalQuestions: 9429,
  },
  {
    _id: "8",
    name: "Machine Learning",
    totalQuestions: 9429,
  },
];

const RightSideBar = () => {
  return (
    <aside className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {HOT_NETWORK.map((item) => {
            return (
              <Link
                key={item.id}
                className="flex cursor-pointer items-center justify-between gap-7"
                href={`/questions/${item.id}`}
              >
                <p className="body-medium text-dark500_light700">
                  {item.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  width={20}
                  height={20}
                  alt="Read More"
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 mb-[26px]">
          Popular Tags
        </h3>
        <div className="mt-7 flex flex-col gap-4">
          {POPULAR_TAGS.map((item) => {
            return <RenderTag {...item} key={item._id} showCount={true} />;
          })}
        </div>
      </div>
    </aside>
  );
};

export default RightSideBar;
