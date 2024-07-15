"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type props = {
  value: string;
  onChange: () => void;
};

export default function DatePicker({ onChange, value }: props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !value && "text-muted-foreground")}>
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
