import { Hono } from "hono";
import { handle } from "hono/vercel";

import user from "@/server/user";
import post from "@/server/post";
import auth from "@/server/auth";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app /*  */
  .route("/user", user)
  .route("/post", post)
  .route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
