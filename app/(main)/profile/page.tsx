import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  const curUserId = session?.user?.id;

  redirect(`/users/${curUserId}`);
}
