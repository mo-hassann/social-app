import db from "@/db";
import { followingTable, updateUserProfileSchema, userInsertSchema, userTable } from "@/db/schemas/user";
import { signInFormSchema, signUpFormSchema } from "@/validators";
import { zValidator } from "@hono/zod-validator";
import { and, count, eq, exists, sql } from "drizzle-orm";
import { Hono } from "hono";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateRandomUserName } from "@/lib";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { format } from "date-fns";

const app = new Hono()
  .post("/register", zValidator("json", signUpFormSchema), async (c) => {
    try {
      const values = c.req.valid("json");

      // check if the user with this email is already exist
      const existingUser = await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(eq(userTable.email, values.email))
        .then((table) => table[0]);
      if (existingUser) {
        return c.json({ message: "user with this email is already exist" }, 400);
      }

      // create random unique user name because it require in the db and user can change this userName in their profile after registration and login successfully
      const userName = generateRandomUserName(values.name, 12, 20);

      // hash the password before send it to the db
      const hashedPassword = bcrypt.hashSync(values.password, 8);

      // add the user to the db
      await db
        .insert(userTable)
        .values({ ...values, userName, password: hashedPassword })
        .returning({ name: userTable.name });

      return c.json({});
    } catch (error: any) {
      console.log(error);
      return c.json({ message: "field to register the user", cause: error?.message }, 400);
    }
  })
  .post("/login", zValidator("json", signInFormSchema), async (c) => {
    try {
      const values = c.req.valid("json");

      // try to sign the user in using Auth js
      await signIn("credentials", { ...values });
    } catch (error: any) {
      if (error instanceof AuthError) {
        console.log(error.message, error.cause, error, "---------------error");
        console.log(error.type, "----------------error type");
        switch (error.type) {
          case "CredentialsSignin":
            return c.json({ message: "email or password is not correct", cause: error?.message }, 400);
          case "CallbackRouteError":
            return c.json({ message: "email or password is not correct", cause: error?.message }, 400);

          default:
            return c.json({ message: "something went wrong.", cause: error?.message }, 400);
        }
      }
      return c.json({});
    }
  })
  .get("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: userId } = c.req.valid("param");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [following] = await db.select({ count: count() }).from(followingTable).where(eq(followingTable.followedBy, userId));
      const [followers] = await db.select({ count: count() }).from(followingTable).where(eq(followingTable.userId, userId));
      const [isFollowed] = await db
        .select()
        .from(followingTable)
        .where(and(eq(followingTable.userId, userId), eq(followingTable.followedBy, curUserId)));

      const [data] = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          bio: userTable.bio,
          image: userTable.image,
          dateOfBirth: userTable.dateOfBirth,
        })
        .from(userTable)
        .where(eq(userTable.id, userId));

      const user = { ...data, followingCount: following.count, followersCount: followers.count, isFollowed: !!isFollowed };
      console.log(user, "---------user");

      return c.json({ data: user });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .post("/follow/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: userId } = c.req.valid("param");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [isFollowing] = await db
        .select()
        .from(followingTable)
        .where(and(eq(followingTable.userId, userId), eq(followingTable.followedBy, curUserId)));

      if (isFollowing) {
        await db.delete(followingTable).where(and(eq(followingTable.userId, userId), eq(followingTable.followedBy, curUserId)));
      } else {
        await db.insert(followingTable).values({ userId, followedBy: curUserId });
      }

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something went wrong went trying to follow this user", cause: error.message }, 400);
    }
  })
  .patch("/", verifyAuth(), zValidator("json", updateUserProfileSchema), async (c) => {
    try {
      const values = c.req.valid("json");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const dateOfBirth = values.dateOfBirth ? format(values.dateOfBirth, "dd-MM-yyyy") : null;

      const data = await db
        .update(userTable)
        .set({ ...values, dateOfBirth })
        .where(eq(userTable.id, curUserId))
        .returning({ userId: userTable.id, name: userTable.name })
        .then((table) => table[0]);

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message });
    }
  });

export default app;
