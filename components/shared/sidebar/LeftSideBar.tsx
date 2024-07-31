"use client";
import React from "react";
import { sidebarLinks } from "@/constants/constants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedOut, useAuth } from "@clerk/nextjs";

const LeftSideBar = () => {
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <aside className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6 ">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route.length > 1);

          if (link.route === "/profile") {
            link.route = `/profile/${userId}`;
          }

          return (
            <Link
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
              key={link.route}
              href={link.route}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors mr-[16px]"}`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/log-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3">
                <Image
                  src="/assets/icons/account.svg"
                  alt="LogIn"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3">
                <Image
                  src="/assets/icons/sign-up.svg"
                  alt="SignUp"
                  width={20}
                  height={20}
                  className="lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
};

export default LeftSideBar;
