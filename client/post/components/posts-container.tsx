import PostCard from "./post-card";

type props = {
  curUserId?: string;
  posts: {
    tags: {
      id: string;
      name: string;
    }[];
    id: string;
    content: string;
    image: string | null;
    createdAt: string;
    userId: string;
    user: string;
    username: string;
    isLiked: never;
    userImage: string | null;
    commentCount: number;
    likeCount: number;
  }[];
};

export default function PostsContainer({ posts, curUserId }: props) {
  return (
    <div className="space-y-3 my-5">
      {posts.map((post) => (
        <PostCard key={post.id} curUserId={curUserId} post={post} />
      ))}
    </div>
  );
}
