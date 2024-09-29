"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

type filterProps = {
  name: string;
  value: string;
};

interface props {
  filterOptions: filterProps[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filterOptions, containerClasses, otherClasses }: props) => {
  // get filter from search params
  const searchParams = useSearchParams();

  const router = useRouter();

  // get filter from search params
  const filter = searchParams.get("filter");

  // handle filter click
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
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleTypeClick}
        defaultValue={filter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 opacity-100`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light800_dark300">
          <SelectGroup>
            {filterOptions.map((option: filterProps) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  <p className="text-dark500_light700"> {option.name}</p>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
