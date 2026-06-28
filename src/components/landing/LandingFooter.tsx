import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/database";

type Props = {
  latestPosts?: Post[];
};

export default function LandingFooter({ latestPosts = [] }: Props) {
  return (
    <footer className="bg-[#141A12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-16 xl:px-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-2xl font-bold tracking-tight sm:text-3xl text-white">
              DentalJournal.online
            </p>
            <p className="mt-6 max-w-md leading-relaxed text-white/55">
              Practical dental health articles, oral care tips, and expert advice
              — written for real people, not research journals.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/45">
                Pages
              </p>
              <ul className="space-y-2.5 text-sm text-white/55">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/blog" className="hover:text-white">Articles</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/write-for-us" className="hover:text-white">Write for Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/45">
                Contact
              </p>
              <ul className="space-y-2.5 text-sm text-white/55">
                <li>
                  <a href="mailto:contact@dentaljournal.online" className="hover:text-white">
                    contact@dentaljournal.online
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {latestPosts.length > 0 && (
            <div className="lg:col-span-4">
              <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/45">
                Latest Articles
              </p>
              <ul className="space-y-4">
                {latestPosts.slice(0, 4).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <p className="font-serif text-lg leading-snug text-white/85 transition group-hover:text-white">
                        {post.title}
                      </p>
                      {post.published_at && (
                        <p className="mt-1 text-xs text-white/40">
                          {formatDate(post.published_at)}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} DentalJournal.online — All rights reserved.</p>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
          <Link href="/admin/login" className="hover:text-white/70">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
