import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type props = {
  image?: string;
  fallbackText?: string;
  className?: string;
};

export default function UserAvatar({ fallbackText, image, className }: props) {
  return (
    <Avatar className={className}>
      <AvatarImage src={image} alt={fallbackText} />
      <AvatarFallback>{fallbackText?.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
