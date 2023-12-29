import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NotFound from "@/components/shared/NotFound";
import Card from "@/components/shared/cards/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/Filters";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
    tags: [
      {
        _id: "1",
        name: "Javascript",
      },
      {
        _id: "2",
        name: "Next.JS",
      },
      {
        _id: "3",
        name: "React.js",
      },
      {
        _id: "4",
        name: "Node.js",
      },
    ],
    author: {
      _id: "1",
      name: "Satheesh",
      picture: "/assets/images/profile.png",
    },
    upvotes: 1.2,
    views: 5.2,
    answers: [],
    createdAt: new Date("2021-09-01T18:30:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div",
    tags: [
      {
        _id: "1",
        name: "Javascript",
      },
      {
        _id: "2",
        name: "Next.JS",
      },
      {
        _id: "3",
        name: "React.js",
      },
      {
        _id: "4",
        name: "Node.js",
      },
    ],
    author: {
      _id: "1",
      name: "Satheesh",
      picture: "/assets/images/profile.png",
    },
    upvotes: 1200,
    views: 520000,
    answers: [],
    createdAt: new Date("2021-09-01T18:30:00.000Z"),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          placeHolder="Search for Questions Here"
          route="/"
          iconPosition="left"
          otherClasses="flex-1"
          imgSrc="/assets/icons/search.svg"
        />
        <Filter
          filterOptions={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length !== 0 ? (
          questions.map((question) => <Card key={question._id} {...question} />)
        ) : (
          <NotFound
            title="There&rsquo;s no question to show"
            description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡`}
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
