import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";

type AnnouncementCardProps = {
  announcement: {
    id: string;
    title: string;
    content: string;
    link: string | null;
  };
};

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div className="card flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
        <Megaphone className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="mb-1 font-semibold text-primary">{announcement.title}</h3>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {announcement.content}
        </p>
        {announcement.link && (
          <Link
            href={announcement.link}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-primary"
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
