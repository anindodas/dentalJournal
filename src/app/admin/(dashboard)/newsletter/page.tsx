import { getNewsletterSubscribers } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsletterPage() {
  let subscribers: Awaited<ReturnType<typeof getNewsletterSubscribers>> = [];
  try {
    subscribers = await getNewsletterSubscribers();
  } catch {
    // tables may not exist yet
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">Newsletter</h1>
        <p className="text-muted-foreground">
          {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(s.subscribed_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="px-6 py-8 text-center text-muted-foreground">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
