import { Hono } from "hono";
import v1 from "./v1";
import { logger } from "hono/logger";
const app = new Hono().basePath("/api");

app.all("*", logger());

const routes = app.route("/v1", v1);

export type AppType = typeof routes;

export default app;
