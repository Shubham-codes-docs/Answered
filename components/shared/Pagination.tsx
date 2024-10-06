"use client";
import React from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // function to handle navigation
  const handleNavigate = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;

    // create a new url with the updated page number
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    // navigate to the new url
    router.push(newUrl);
  };

  return (
    <div className="flex-center w-full gap-2">
      <Button
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
        disabled={pageNumber === 1}
        onClick={() => handleNavigate("prev")}
      >
        <p className="body-medium text-dark200_light800">Previous</p>
      </Button>
      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
        disabled={!isNext}
        onClick={() => handleNavigate("next")}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
