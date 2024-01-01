"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { questionSchema } from "@/lib/validations";
import { Badge } from "../ui/badge";
import { createQuestion } from "@/lib/actions/question.action";

const Question = () => {
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const value = tagInput.value.trim();
      if (value !== "") {
        if (value.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag length should be less than 15 characters",
          });
        }
        if (!field.value.includes(value as never)) {
          form.setValue("tags", [...field.value, value], {
            shouldValidate: true,
          });
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    console.log("Clicked");
    setIsSubmitting(true);
    try {
      await createQuestion(values);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const type: any = "create";

  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Title
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Try giving a question title that is self-explainatory.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Question Description
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onChange={(content) => {
                      field.onChange(content);
                    }}
                    initialValue=""
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks codesample fullscreen",
                        "insertdatetime media table ",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                    }}
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Give a detailed description of your problem. Minimum 20
                  characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <>
                    <Input
                      placeholder="Add Tags..."
                      onKeyDown={(e) => handleOnKeyDown(e, field)}
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    />
                    <div className="mt-2.5 flex gap-2.5">
                      {field.value.length > 0 &&
                        field.value.map((tag) => {
                          return (
                            <Badge
                              key={tag}
                              className="subtle-medium background-light800_dark300 text-dark400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            >
                              {tag}
                              <Image
                                src="/assets/icons/close.svg"
                                alt="close"
                                width={12}
                                height={12}
                                onClick={() => {
                                  handleTagRemove(tag, field);
                                }}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            </Badge>
                          );
                        })}
                    </div>
                  </>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add upto 3 tags that best describe your question.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="primary-gradient w-fit text-light-900"
            disabled={isSubmitting}
            onClick={() => {
              onSubmit(form.getValues());
            }}
          >
            {isSubmitting ? (
              <>{type === "edit" ? "Editing..." : "Posting..."}</>
            ) : (
              <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Question;
