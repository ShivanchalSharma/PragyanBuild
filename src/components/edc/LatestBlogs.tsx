import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  link: string;
  date: string;
  image: string | null;
}

const FEED_URL = "https://edciitdelhi.substack.com/feed";
const RSS2JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;

export function LatestBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(RSS2JSON)
      .then((res) => res.json())
      .then((data) => {
        const parsed: BlogPost[] = data.items.slice(0, 4).map((item: any) => ({
          title: item.title,
          link: item.link,
          date: new Date(item.pubDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          }),
          image: item.thumbnail || item.enclosure?.link || null,
        }));
        setPosts(parsed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">
          Latest from eDC
        </h2>
        <a
          href="https://edciitdelhi.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-accent hover:opacity-80 transition-opacity uppercase tracking-wider"
        >
          View All <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-card border border-border animate-pulse h-56" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No posts found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post, i) => (
            
            <a key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl bg-card border border-border overflow-hidden hover:border-accent/50 transition-colors"
            >
              <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-3xl">📰</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{post.date}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}