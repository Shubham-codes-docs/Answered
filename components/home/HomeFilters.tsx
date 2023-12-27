"use client";
import React from "react";
import { HomePageFilters } from "@/constants/Filters";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((option) => {
        return (
          <Button
            key={option.value}
            onChange={() => {}}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              active === option.value
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
