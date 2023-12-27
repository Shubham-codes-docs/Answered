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
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filterOptions.map((option: filterProps) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  <p className=""> {option.name}</p>
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
