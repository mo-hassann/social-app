import { Hono } from "hono";
import { handle } from "hono/vercel";

import user from "@/server/user";
import post from "@/server/post";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app /*  */
  .route("/user", user)
  .route("/post", post);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
