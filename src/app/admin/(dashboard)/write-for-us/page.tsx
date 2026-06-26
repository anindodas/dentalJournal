import { getWriteForUsSubmissions } from "@/lib/queries";
import AdminWriteForUsClient from "@/components/admin/AdminWriteForUs";

export default async function AdminWriteForUsPage() {
  let submissions: Awaited<ReturnType<typeof getWriteForUsSubmissions>> = [];
  try {
    submissions = await getWriteForUsSubmissions();
  } catch {
    // tables may not exist yet
  }

  return (
    <AdminWriteForUsClient
      initial={submissions.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        topic: s.topic,
        bio: s.bio,
        sample_url: s.sample_url,
        message: s.message,
        status: s.status,
        createdAt: s.created_at,
      }))}
    />
  );
}
