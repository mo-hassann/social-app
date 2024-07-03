import { clerkMiddleware } from "@clerk/nextjs/server";

// Make sure that the `/api/webhooks/(.*)` route is not protected here
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
