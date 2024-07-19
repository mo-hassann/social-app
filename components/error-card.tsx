import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function ErrorCard() {
  const router = useRouter();
  return (
    <div className="size-full flex flex-col items-center justify-center gap-2 my-5">
      <h1 className="text-3xl font-bold">Something Went Wrong</h1>
      <p className="text-muted-foreground">there is some issues</p>
      <Button onClick={() => router.refresh()}>Try Again</Button>
    </div>
  );
}
