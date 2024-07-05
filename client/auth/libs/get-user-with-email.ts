import db from "@/db";
import { userTable } from "@/db/schemas/user";
import { eq } from "drizzle-orm";

export const getUserWithEmail = async (email: string) => {
  try {
    const user = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(eq(userTable.email, email))
      .then((table) => table[0]);

    return user;
  } catch (error) {
    console.log("ERROR: ", error);
    return null;
  }
};
