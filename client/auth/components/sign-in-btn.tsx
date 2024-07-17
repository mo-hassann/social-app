import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/routes";
import { redirect } from "next/navigation";

export default function SignInBtn() {
  return (
    <form
      action={async () => {
        "use server";
        try {
          redirect("/sign-in");
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <Button>sign in</Button>
    </form>
  );
}
