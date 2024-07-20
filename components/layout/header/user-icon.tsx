import SignInBtn from "@/client/auth/components/sign-in-btn";
import SignOutBtn from "@/client/auth/components/sign-out-btn";
import UserAvatar from "@/components/user-avatar";
import { currentUser } from "@/lib/auth";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User2Icon } from "lucide-react";
import { signOut } from "@/auth";
import { DEFAULT_SIGN_OUT_REDIRECT } from "@/routes";
import { redirect } from "next/navigation";
import Link from "next/link";
import client from "@/server/client";

export default async function UserIcon() {
  const user = await currentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="hover:outline-1 outline-primary" fallbackText={user?.name || undefined} image={user?.image || undefined} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/users/${user?.id}`}>
            <User2Icon size={16} className="mr-2" /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-red-700/10 text-red-600 hover:bg-red-700/75 hover:text-white">
          <SignOutBtn>
            <LogOut size={16} className="mr-2" /> Logout
          </SignOutBtn>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
