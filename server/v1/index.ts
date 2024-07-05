import { Hono } from "hono";

import user from "./user";
import post from "./post";

const app = new Hono();

const routes = app /*  */
  .route("/user", user)
  .route("/post", post);

export default routes;
