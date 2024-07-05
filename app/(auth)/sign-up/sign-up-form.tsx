import { signIn } from "@/auth";
import db from "@/db";
import { signInSchema } from "../sign-in/sign-in-schema";
import { userTable } from "@/db/schemas/user";

export default function SignUpForm() {
  return (
    <form
      action={async (formData) => {
        "use server";
        const { email, password } = { email: formData.get("email") as string, password: formData.get("password") as string };
        await db.insert(userTable).values({ email, password, name: "test", userName: "test name" });
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
