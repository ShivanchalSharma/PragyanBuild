import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  link: string;
  date: string;
  image: string | null;
}


const CORS_PROXY = "https://corsproxy.io/?";
const FEED_URL = "https://edciitdelhi.substack.com/feed";

export function LatestBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${CORS_PROXY}${encodeURIComponent(FEED_URL)}`)
  .then((res) => res.text())
  .then((contents) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).slice(0, 4);

        const parsed: BlogPost[] = items.map((item) => {
          // try to get thumbnail from media:content or enclosure
          const media =
            item.querySelector("enclosure")?.getAttribute("url") ||
            item.getElementsByTagNameNS("*", "content")[0]?.getAttribute("url") ||
            null;

          // fallback: extract first <img> from content:encoded
          let image = media;
          if (!image) {
            const encoded = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent || "";
            const match = encoded.match(/<img[^>]+src="([^">]+)"/);
            image = match ? match[1] : null;
          }

          return {
            title: item.querySelector("title")?.textContent || "",
            link: item.querySelector("link")?.textContent || "#",
            date: new Date(item.querySelector("pubDate")?.textContent || "").toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            }),
            image,
          };
        });

        setPosts(parsed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold tracking-widest text-foreground uppercase">Latest from eDC</h2>
        
        <a  href="https://edciitdelhi.substack.com"
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