import { Hono } from "hono";

import test from "./test";
import post from "./post";

const app = new Hono();

const routes = app /*  */
  .route("/test", test)
  .route("/post", post);

export default routes;
