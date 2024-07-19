import SignInBtn from "@/client/auth/components/sign-in-btn";
import SignOutBtn from "@/client/auth/components/sign-out-btn";
import UserAvatar from "@/components/user-avatar";
import { currentUser } from "@/lib/auth";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default async function UserIcon() {
  const user = await currentUser();
  return (
    <Popover>
      <PopoverTrigger>
        <UserAvatar className="hover:outline-1 outline-primary" fallbackText={user?.name || undefined} image={user?.image || undefined} />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
