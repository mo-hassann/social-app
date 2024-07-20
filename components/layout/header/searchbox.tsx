"use client";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Searchbox({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        router.push(`/search?q=${searchQuery}`);
      } else if (pathname.startsWith("/search") && !searchQuery) {
        router.push("/");
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, pathname, router]);

  return <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.replaceAll("#", ""))} className={cn("rounded-full w-[250px] h-[40px]", className)} placeholder="search..." />;
}
