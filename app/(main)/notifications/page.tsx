"use client";

import useGetNotifications from "@/client/notification/api/use-get-notifications";
import Notification from "@/client/notification/components/notification";

import ErrorCard from "@/components/error-card";
import NoDataCard from "@/components/no-data-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationPage() {
  const notificationQuery = useGetNotifications();

  const isError = notificationQuery.isError;
  const isLoading = notificationQuery.isLoading || notificationQuery.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <NotificationSkeleton />;
  if (notificationQuery.data.length === 0) return <NoDataCard />;

  return (
    <div className="flex flex-col gap-2">
      {notificationQuery.data.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

const NotificationSkeleton = () => (
  <div className="flex items-center gap-2 w-full">
    <Skeleton className="size-16 rounded-full shrink-0" />
    <div className="w-full space-y-2">
      <Skeleton className="w-8/12 h-7 rounded-md" />
      <Skeleton className="w-full h-7 rounded-md" />
    </div>
  </div>
);
