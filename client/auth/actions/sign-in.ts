"use server";

import { signIn } from "@/auth";
import React from "react";
import { getUserWithEmail } from "../libs/get-user-with-email";
import { signInSchemaType } from "../schemas";

export default async function SignIn(data: signInSchemaType) {
  // check email exist before sign in with data
  const existingUser = await getUserWithEmail(data.email);
  if (!existingUser) throw new Error("user does not exist");

  // sing the user in
  await signIn("credentials", { ...data, redirect: false });
}
