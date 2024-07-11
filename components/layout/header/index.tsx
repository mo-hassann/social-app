import Logo from "./logo";
import Searchbox from "./searchbox";
import UserIcon from "./user-icon";

export default function Header() {
  return (
    <header className="flex items-center py-3 bg-muted shadow-md rounded-xl px-6">
      <Logo />
      <Searchbox />
      <UserIcon />
    </header>
  );
}
