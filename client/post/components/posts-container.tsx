import NoDataCard from "@/components/no-data-card";
import PostCard from "./post-card";

type props = {
  curUserId?: string;
  posts: {
    id: string;
    content: string;
    image: string | null;
    createdAt: string;
    userId: string;
    user: string;
    username: string;
    isLiked: boolean;
    userImage: string | null;
    commentCount: number;
    likeCount: number;
  }[];
};

export default function PostsContainer({ posts, curUserId }: props) {
  if (posts.length === 0) return <NoDataCard />;
  return (
    <div className="space-y-3 my-5">
      {posts.map((post) => (
        <PostCard key={post.id} curUserId={curUserId} post={post} />
      ))}
    </div>
  );
}
