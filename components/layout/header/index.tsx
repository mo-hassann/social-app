import Link from "next/link";

import Searchbox from "./searchbox";
import UserIcon from "./user-icon";
import Logo from "@/components/logo";
import Navbar from "./navbar";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-3 px-6">
      <div className="flex items-center gap-7 w-96">
        <Link href="/">
          <Logo />
        </Link>
        <Searchbox className="hidden lg:block" />
      </div>

      <Navbar />

      <div className="flex items-center justify-end w-96">
        <UserIcon />
      </div>
    </header>
  );
}
