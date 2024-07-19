"use client";
import useGetCurUserFollowers from "@/client/user/api/use-get-cur-user-followers";
import useGetCurUserFollowing from "@/client/user/api/use-get-cur-user-following";
import useGetCurUserSuggestion from "@/client/user/api/use-get-cur-user-suggestion";
import ErrorCard from "@/components/error-card";
import UserAvatar from "@/components/user-avatar";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingSection from "./_components/following-section";
import FollowersSection from "./_components/followers-section";
import SuggestionSection from "./_components/suggestion-section";

export default function FollowingPage() {
  return (
    <div className="space-y-3">
      <Tabs defaultValue="following" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger className="w-full" value="following">
            following
          </TabsTrigger>
          <TabsTrigger className="w-full" value="followers">
            followers
          </TabsTrigger>
          <TabsTrigger className="w-full" value="suggestion">
            suggestion
          </TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          <FollowingSection />
        </TabsContent>
        <TabsContent value="followers">
          <FollowersSection />
        </TabsContent>
        <TabsContent value="suggestion">
          <SuggestionSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
