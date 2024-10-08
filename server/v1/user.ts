import db from "@/db";
import { followingTable, updateUserProfileSchema, userInsertSchema, userTable } from "@/db/schemas/user";
import { signInFormSchema, signUpFormSchema } from "@/validators";
import { zValidator } from "@hono/zod-validator";
import { and, count, eq, exists, isNull, not, or, sql } from "drizzle-orm";
import { Hono } from "hono";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateRandomUserName } from "@/lib";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { format } from "date-fns";
import { notificationTable } from "@/db/schemas/notification";

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
  .post("/sign-out", async (c) => {
    try {
      await signOut();
      return c.json({});
    } catch (error: any) {
      return c.json({ message: "field to sign out", cause: error?.message });
    }
  })

  .get("/", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [data] = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          bio: userTable.bio,
          image: userTable.image,
          dateOfBirth: userTable.dateOfBirth,
          followersCount: userTable.followersCount,
          followingCount: userTable.followingCount,
        })
        .from(userTable)
        .leftJoin(followingTable, eq(followingTable.userId, userTable.id))
        .where(eq(userTable.id, curUserId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .get("/following", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const data = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          image: userTable.image,
        })
        .from(userTable)
        .innerJoin(followingTable, eq(followingTable.userId, userTable.id))
        .where(eq(followingTable.followedBy, curUserId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .get("/followers", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const data = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          image: userTable.image,
        })
        .from(userTable)
        .innerJoin(followingTable, eq(followingTable.followedBy, userTable.id))
        .where(eq(followingTable.userId, curUserId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .get("/suggested-users", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const data = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          image: userTable.image,
        })
        .from(userTable)
        .leftJoin(followingTable, and(eq(followingTable.userId, userTable.id), eq(followingTable.followedBy, curUserId)))
        .where(and(not(eq(userTable.id, curUserId)), isNull(followingTable.userId)));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .get("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: userId } = c.req.valid("param");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [data] = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          username: userTable.userName,
          email: userTable.email,
          bio: userTable.bio,
          image: userTable.image,
          dateOfBirth: userTable.dateOfBirth,
          followersCount: userTable.followersCount,
          followingCount: userTable.followingCount,
          isFollowed: sql`(${followingTable.userId} = ${userTable.id}) and (${followingTable.followedBy} = ${curUserId})`,
        })
        .from(userTable)
        .leftJoin(followingTable, eq(followingTable.userId, userTable.id))
        .where(eq(userTable.id, userId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .post("/follow/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: userId } = c.req.valid("param");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      if (userId === curUserId) return c.json("the user can not follow their self", 400);

      const [isFollowing] = await db
        .select({ id: followingTable.id })
        .from(followingTable)
        .where(and(eq(followingTable.userId, userId), eq(followingTable.followedBy, curUserId)));

      if (isFollowing) {
        await db.delete(followingTable).where(and(eq(followingTable.userId, userId), eq(followingTable.followedBy, curUserId)));
        await db
          .update(userTable)
          .set({ followersCount: sql`${userTable.followersCount} - 1` })
          .where(eq(userTable.id, userId));
        await db
          .update(userTable)
          .set({ followingCount: sql`${userTable.followingCount} - 1` })
          .where(eq(userTable.id, curUserId));

        // send notification
        await db.insert(notificationTable).values({ userId: curUserId, toUserId: userId, notificationName: "NEW_FOLLOWER" }).onConflictDoNothing();
      } else {
        await db.insert(followingTable).values({ userId, followedBy: curUserId });
        await db
          .update(userTable)
          .set({ followersCount: sql`${userTable.followersCount} + 1` })
          .where(eq(userTable.id, userId));
        await db
          .update(userTable)
          .set({ followingCount: sql`${userTable.followingCount} + 1` })
          .where(eq(userTable.id, curUserId));
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
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  });

export default app;
