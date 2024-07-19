"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { newPostFormSchema } from "@/validators";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import UserAvatar from "@/components/user-avatar";
import Spinner from "@/components/spinner";
import { cn } from "@/lib/utils";

const FormSchema = newPostFormSchema;
type FormSchemaType = z.infer<typeof FormSchema>;

type props = {
  onSubmit: (values: FormSchemaType) => void;
  defaultValues: FormSchemaType;
  isPending: boolean;
  className?: string;
  curUser?: {
    name?: string;
    image?: string;
  };
};

export default function NewPostForm({ defaultValues, onSubmit, isPending, curUser, className }: props) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-3 bg-card p-3.5 mb-2 rounded-md", className)}>
        <div className="flex items-center gap-2">
          <UserAvatar className="size-12" fallbackText={curUser?.name || undefined} image={curUser?.image || undefined} />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea className="rounded-lg bg-input" disabled={isPending} placeholder="what's in your mind?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="place-self-end px-9" disabled={isPending || !form.formState.isDirty || !form.formState.isValid} type="submit">
          {isPending && <Spinner className="mr-1 size-5" />}
          Post
        </Button>
      </form>
    </Form>
  );
}
