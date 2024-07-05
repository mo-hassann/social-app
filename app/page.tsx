import Spinner from "@/components/spinner";
import { signOut } from "@/auth";
import { currentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await currentUser();
  return (
    <div>
      {JSON.stringify(user)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>sign out</Button>
      </form>
      <Spinner />
    </div>
  );
}
