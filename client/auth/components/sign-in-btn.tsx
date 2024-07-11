import { signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignInBtn() {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signIn();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <Button>sign in</Button>
    </form>
  );
}
