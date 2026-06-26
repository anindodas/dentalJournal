import { getContactMessages } from "@/lib/queries";
import AdminMessagesClient from "@/components/admin/AdminMessages";

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof getContactMessages>> = [];
  try {
    messages = await getContactMessages();
  } catch {
    // tables may not exist yet
  }

  return (
    <AdminMessagesClient
      initial={messages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        createdAt: m.created_at,
      }))}
    />
  );
}
