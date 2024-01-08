import Filter from "@/components/shared/Filter";
import NotFound from "@/components/shared/NotFound";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/Filters";
import { getAllTags } from "@/lib/actions/tags.action";
import Link from "next/link";
import React from "react";

const page = async () => {
  const res = await getAllTags({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          placeHolder="Search for your kind"
          route="/tags"
          iconPosition="left"
          otherClasses="flex-1"
          imgSrc="/assets/icons/search.svg"
        />
        <Filter
          filterOptions={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {res.tags.length > 0 ? (
          res.tags.map((tag) => {
            return (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className="shadow-light100_darknone"
              >
                <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                  <div className="background-light800_dark400 w-fit rounded-lg px-5 py-1.5">
                    <p className="paragraph-semibold text-dark300_light900">
                      {tag.name}
                    </p>
                  </div>
                  <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">
                      {tag.questions.length}+{" "}
                    </span>
                    Questions
                  </p>
                </article>
              </Link>
            );
          })
        ) : (
          <NotFound
            title="No tags found"
            description="It looks like there are no tags to be shown."
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </section>
    </>
  );
};

export default page;
