import SignInBtn from "@/client/auth/components/sign-in-btn";
import SignOutBtn from "@/client/auth/components/sign-out-btn";
import { currentUser } from "@/lib/auth";

export default async function UserIcon() {
  const user = await currentUser();
  return (
    <div className="flex items-center gap-2">
      <span>{user && user.name}</span>
      {user ? <SignOutBtn /> : <SignInBtn />}
    </div>
  );
}
