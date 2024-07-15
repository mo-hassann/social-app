import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type props = {
  className?: string;
  size?: number;
};

export default function Spinner({ className, size }: props) {
  return <Loader2 size={size} className={cn("animate-spin", className)} />;
}
