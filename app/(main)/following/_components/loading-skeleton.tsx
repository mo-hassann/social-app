import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="size-24 rounded-full flex-shrink-0" />
        <div className="w-full space-y-2">
          <Skeleton className="w-7/12 h-8 rounded-md" />
          <Skeleton className="w-24 h-8 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="size-24 rounded-full flex-shrink-0" />
        <div className="w-full space-y-2">
          <Skeleton className="w-7/12 h-8 rounded-md" />
          <Skeleton className="w-24 h-8 rounded-md" />
        </div>
      </div>
      <div className="flex items-center gap-3 w-full">
        <Skeleton className="size-24 rounded-full flex-shrink-0" />
        <div className="w-full space-y-2">
          <Skeleton className="w-7/12 h-8 rounded-md" />
          <Skeleton className="w-24 h-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
