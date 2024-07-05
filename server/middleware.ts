import { Hono } from "hono";
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";
import { authHandler, getAuthUser, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { NextResponse } from "next/server";
import { Context } from "hono";
import Credentials from "@auth/core/providers/credentials";
import { AuthConfig } from "@hono/auth-js";
import authConfig from "@/auth.config";

function getAuthConfig(c: Context): AuthConfig {
  console.log("SECRET11: ", c.env.AUTH_SECRET, process.env.AUTH_SECRET);
  return {
    secret: c.env.AUTH_SECRET,
    ...authConfig,
  };
}

const app = new Hono();

app.all("/api/v1/*", initAuthConfig(getAuthConfig));
app.use("/api/auth/*", authHandler());
app.use("/api/v1/*", verifyAuth());

app.get("/api/v1/users", (c) => {
  const auth = c.get("authUser");
  return c.json(auth);
});

app.all("*", async (c) => {
  console.log(c.env);
  Response.redirect(new URL("/sign-on", c.req.url));
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
});

export default app;
