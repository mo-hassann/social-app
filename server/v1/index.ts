import { Hono } from "hono";

import post from "./post";
import user from "./user";
import like from "./like";
import comment from "./comment";

const app = new Hono();

const routes = app /**/
  .route("/post", post)
  .route("/user", user)
  .route("/like", like)
  .route("/comment", comment);

export default routes;
