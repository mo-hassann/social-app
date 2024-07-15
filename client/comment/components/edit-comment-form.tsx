"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { newCommentFormSchema } from "@/validators";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { editCommentSchema } from "@/db/schemas/comment";

const FormSchema = editCommentSchema;
type FormSchemaType = z.infer<typeof FormSchema>;

type props = {
  onSubmit: (values: FormSchemaType) => void;
  defaultValues: FormSchemaType;
  disabled: boolean;
  className?: string;
};

export default function EditCommentForm({ defaultValues, onSubmit, disabled }: props) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 flex items-center gap-3"}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea disabled={disabled} placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={disabled} size="icon" type="submit">
          <SendHorizonal />
        </Button>
      </form>
    </Form>
  );
}
