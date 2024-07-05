import { getAuthUser, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const auth = c.get("authConfig");
  return c.json({ auth, data: "some other data" });
});

export default app;
