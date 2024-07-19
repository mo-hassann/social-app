"use client";

import useGetNotifications from "@/client/notification/api/use-get-notifications";
import NotificationItem from "@/client/notification/components/notification-item";
import ErrorCard from "@/components/error-card";
import NoDataCard from "@/components/no-data-card";

export default function NotificationPage() {
  const notificationQuery = useGetNotifications();

  const isError = notificationQuery.isError;
  const isLoading = notificationQuery.isLoading || notificationQuery.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <div>loading...</div>;
  if (notificationQuery.data.length === 0) return <NoDataCard />;

  return (
    <div className="m-3 text-left p-0">
      {notificationQuery.data.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
