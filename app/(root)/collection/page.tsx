import { auth } from "@clerk/nextjs";
import Filter from "@/components/shared/Filter";
import NotFound from "@/components/shared/NotFound";
import Card from "@/components/shared/cards/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/Filters";
import { getSavedQuestions } from "@/lib/actions/user.action";

const Home = async () => {
  // get clerkId of the user
  const { userId: clerkId } = auth();

  // check if user is logged in
  if (!clerkId) return null;

  // get all saved questions
  const questions = await getSavedQuestions({ clerkId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          placeHolder="Search for Questions Here"
          route="/"
          iconPosition="left"
          otherClasses="flex-1"
          imgSrc="/assets/icons/search.svg"
        />
        <Filter
          filterOptions={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.savedQuestions.length !== 0 ? (
          questions.savedQuestions.map((question: any) => (
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
            title="There&rsquo;s no question saved to show"
            description={`Save Questions relevant to you and do not miss updates on them.`}
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
