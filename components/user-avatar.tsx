import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type props = {
  image?: string;
  fallbackText?: string;
  className?: string;
};

export default function UserAvatar({ fallbackText, image, className }: props) {
  return (
    <Avatar className={cn("bg-muted", className)}>
      <AvatarImage src={image} alt={fallbackText} />
      <AvatarFallback className="bg-inherit">{fallbackText?.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
