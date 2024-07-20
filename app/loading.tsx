import Spinner from "@/components/spinner";

export default function Loading() {
  return (
    <div className="size-full">
      <Spinner className="text-primary w-full mt-32" />
    </div>
  );
}
