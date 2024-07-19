"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill, GoHome, GoPerson, GoPersonFill, GoBellFill, GoBell, GoSearch } from "react-icons/go";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Searchbox from "./searchbox";

const navItems = [
  {
    id: 1,
    name: "Home",
    icon: GoHome,
    activeIcon: GoHomeFill,
    path: "/",
  },
  {
    id: 2,
    name: "following",
    icon: GoPerson,
    activeIcon: GoPersonFill,
    path: "/following",
  },
  {
    id: 3,
    name: "Notifications",
    icon: GoBell,
    activeIcon: GoBellFill,
    path: "/notifications",
  },
  {
    id: 4,
    name: "Profile",
    icon: GoPerson,
    activeIcon: GoPersonFill,
    path: "/profile",
  },
];

export default function Navbar() {
  const curPathname = usePathname();

  return (
    <nav className="flex items-center gap-4 sm:gap-6 md:gap-10">
      {navItems.map(({ id, icon: Icon, activeIcon: ActiveIcon, name, path }) => {
        const isActive = curPathname === path && (curPathname.startsWith(path) || curPathname.startsWith("/users"));
        return (
          <NavbarTooltip key={id} name={name}>
            <Link className="text-2xl hover:opacity-70" href={path}>
              {isActive ? (
                <div className="text-primary relative">
                  <ActiveIcon />
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 size-1.5 bg-primary rounded-full" />
                </div>
              ) : (
                <Icon />
              )}
            </Link>
          </NavbarTooltip>
        );
      })}
      <SearchPopoverButton />
    </nav>
  );
}

const SearchPopoverButton = () => (
  <Popover modal>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" className="text-2xl hover:opacity-70 lg:hidden">
        <GoSearch />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Searchbox />
    </PopoverContent>
  </Popover>
);

type props = {
  name: string;
  children: React.ReactNode;
};

const NavbarTooltip = ({ name, children }: props) => {
  return (
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="translate-y-2">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
