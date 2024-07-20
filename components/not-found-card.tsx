"use client";

import Link from "next/link";

export default function NotFoundCard() {
  return (
    <div className="size-full flex flex-col items-center mt-12 gap-2 my-5">
      <h1 className="text-9xl font-bold">404</h1>
      <h1 className="text-3xl font-bold text-muted-foreground">Not Found</h1>
      <p className="text-muted-foreground">this route does not exists</p>
      <Link href="/">Back To Home</Link>
    </div>
  );
}
