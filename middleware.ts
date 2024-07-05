/* import { Hono } from "hono";
import { auth } from "./auth";
import { DEFAULT_SIGN_IN_REDIRECT, DEFAULT_SIGN_OUT_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";
import { authHandler, getAuthUser, initAuthConfig, verifyAuth } from "@hono/auth-js";
import getAuthConfig from "./auth.config";
import { NextResponse } from "next/server";
import { handle } from "hono/vercel";

const app = new Hono();

app.use("/api/v1/*", initAuthConfig(getAuthConfig));
app.use("/api/auth/*", authHandler());
app.use("/api/v1/*", verifyAuth());

app.get("/api/v1/users", (c) => {
  const auth = c.get("authUser");
  return c.json(auth);
});

app.all("*", async (c) => {
  const authUser = await getAuthUser(c);

  const pathname = new URL(c.req.url).pathname;
  const isAuthenticated = !!authUser?.session;

  const isApiAuthRoute = apiAuthPrefix.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL("/protected", c.req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL("/sign-in", c.req.url));
  }

  return NextResponse.next();
}); */

// import { handle } from "hono/vercel";
// import app from "./server/middleware";

// export { auth as middleware } from "./auth";
// export default handle(app);

// import { auth } from "./auth";
// import { DEFAULT_SIGN_IN_REDIRECT, DEFAULT_SIGN_OUT_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";
/* export function auth((req) => {
  // const { nextUrl } = req;
  // const isLoggedIn = !!req.auth;
  // console.log("IS LOGGED IN", isLoggedIn);

  // const isApiAuthRoute = apiAuthPrefix.some((route) => nextUrl.pathname.startsWith(route));
  // const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));
  // const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // if (isApiAuthRoute) return;

  // if (isAuthRoute) {
  //   if (isLoggedIn) return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
  //   return;
  // }

  // if (!isLoggedIn && !isPublicRoute) return Response.redirect(new URL(DEFAULT_SIGN_OUT_REDIRECT, nextUrl));

  return;
}); */

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DEFAULT_SIGN_IN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  return;
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = apiAuthPrefix.some((route) => nextUrl.pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
    return;
  }

  if (!isLoggedIn && !isPublicRoute) return Response.redirect(new URL("/auth/login", nextUrl));

  return;
});

export { auth as middleware };

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
