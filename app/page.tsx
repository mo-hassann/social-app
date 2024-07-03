import Spinner from "@/components/spinner";
import { SignInButton, SignedIn, SignedOut, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </ClerkLoaded>
    </div>
  );
}
