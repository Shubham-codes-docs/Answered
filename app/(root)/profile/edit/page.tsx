import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const mongoUser = await getUserById({ userId: clerkId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={clerkId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default page;
