import { Hono } from "hono";

import post from "./post";
import user from "./user";
import like from "./like";
import comment from "./comment";
import notifications from "./notifications";
import tags from "./tags";

const app = new Hono();

const routes = app /**/
  .route("/post", post)
  .route("/tags", tags)
  .route("/user", user)
  .route("/like", like)
  .route("/comment", comment)
  .route("/notifications", notifications);

export default routes;
