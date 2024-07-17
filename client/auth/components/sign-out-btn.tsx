import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { DEFAULT_SIGN_OUT_REDIRECT } from "@/routes";
import { redirect } from "next/navigation";

export default function SignOutBtn() {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signOut();
          redirect(DEFAULT_SIGN_OUT_REDIRECT);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <Button>sign out</Button>
    </form>
  );
}
