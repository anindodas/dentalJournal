export function getDisplayReads(post: {
  reads: number;
  reads_per_day: number;
  reads_started_at: string | null;
  published_at: string | null;
  created_at: string;
}): number {
  const anchor = post.reads_started_at || post.published_at || post.created_at;
  const startMs = new Date(anchor).getTime();
  const days = Math.max(0, Math.floor((Date.now() - startMs) / 86_400_000));
  return post.reads + days * (post.reads_per_day || 0);
}

export function formatReads(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 10_000) {
    return `${Math.round(count / 1_000)}K`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toLocaleString();
}
