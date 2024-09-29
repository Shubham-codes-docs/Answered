"use client";
import React from "react";
import { HomePageFilters } from "@/constants/Filters";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // get filter from search params
  const filter = searchParams.get("filter");

  const handleTypeClick = (item: string) => {
    if (item === filter) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((option) => {
        return (
          <Button
            key={option.value}
            onClick={() => handleTypeClick(option.value)}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              filter === option.value
                ? "bg-primary-100 text-primary-500"
                : "bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-700"
            }`}
          >
            {option.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
