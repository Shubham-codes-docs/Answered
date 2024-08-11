"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/validations";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

interface ProfileProps {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: ProfileProps) => {
  const parsedUser = JSON.parse(user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      userName: parsedUser.userName || "",
      name: parsedUser.name || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
      websiteLink: parsedUser.websiteLink || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          userName: values.userName,
          location: values.location,
          bio: values.bio,
          websiteLink: values.websiteLink,
        },
        path: pathName,
      });
      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Username"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteLink"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your Portfolio Url"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you located?"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a short bio about yourself"
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
