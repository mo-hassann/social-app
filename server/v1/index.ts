import { Hono } from "hono";

import test from "./test";
import post from "./post";
import user from "./user";
import like from "./like";
import comment from "./comment";

const app = new Hono();

const routes = app /*  */
  .route("/test", test)
  .route("/post", post)
  .route("/user", user)
  .route("/like", like)
  .route("/comment", comment);

export default routes;
