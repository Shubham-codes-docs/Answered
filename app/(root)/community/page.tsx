import Filter from "@/components/shared/Filter";
import UserCard from "@/components/shared/cards/UserCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/Filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";

const Page = async () => {
  const res = await getAllUsers({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          placeHolder="Search for your kind"
          route="/community"
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
        {res.users.length > 0 ? (
          res.users.map((user) => {
            return <UserCard key={user._id} user={user} />;
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users Yet!</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Be the first to join us!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
