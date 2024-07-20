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
import UserAvatar from "@/components/user-avatar";
import type { AdapterUser } from "@auth/core/adapters";

const FormSchema = newCommentFormSchema;
type FormSchemaType = z.infer<typeof FormSchema>;

type props = {
  onSubmit: (values: FormSchemaType) => void;
  defaultValues: FormSchemaType;
  disabled: boolean;
  className?: string;
  curUser: AdapterUser;
};

export default function NewCommentForm({ curUser, defaultValues, onSubmit, disabled, className }: props) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
        <div className="flex gap-1.5 p-1">
          <UserAvatar className="size-10" fallbackText={curUser.name || undefined} image={curUser.image || undefined} />
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
        </div>
        <Button className="self-end" disabled={disabled} size="sm" type="submit">
          Comment
        </Button>
      </form>
    </Form>
  );
}
