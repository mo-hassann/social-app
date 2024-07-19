import Link from "next/link";

export default function HashtagsMainCard() {
  const hashtag = "test";
  return (
    <div className="space-y-3">
      <h2 className="text-xl">Trending Hashtags</h2>
      <ul className="flex gap-4 flex-wrap">
        <Link href={`/?search=${hashtag}`} className="rounded-full bg-card text-muted-foreground px-3 py-1.5 hover:bg-muted hover:text-white cursor-pointer">
          #lorem
        </Link>
        <Link href={`/?search=${hashtag}`} className="rounded-full bg-card text-muted-foreground px-3 py-1.5 hover:bg-muted hover:text-white cursor-pointer">
          #lorem_er
        </Link>
        <Link href={`/?search=${hashtag}`} className="rounded-full bg-card text-muted-foreground px-3 py-1.5 hover:bg-muted hover:text-white cursor-pointer">
          #lorem_eet_tsd
        </Link>
      </ul>
    </div>
  );
}
