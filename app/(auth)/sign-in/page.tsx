"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import useSignIn from "@/client/auth/api/use-sign-in";
import SignInForm from "@/client/auth/components/sign-in-form";

export default function SignInPage() {
  const singInMutation = useSignIn();

  const isPending = singInMutation.isPending;
  return (
    <Card className="w-96 pt-5 pb-8">
      <CardHeader>
        <CardTitle>Sing in</CardTitle>
        <CardDescription>this is sign in page</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm defaultValues={{ email: "", password: "" }} disabled={isPending} onSubmit={(values) => singInMutation.mutate(values)} />
      </CardContent>
    </Card>
  );
}
