import { createSupabaseAdmin, createSupabaseClient } from "./supabase/client";
import type { PageSeo, Post, ContactMessage, WriteForUsSubmission, User } from "@/types/database";
import { getDisplayReads } from "./reads";

export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string;
  cover_image?: string | null;
  published?: boolean;
  featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  reads?: number;
  reads_per_day?: number;
  published_at?: string | null;
  has_toc?: boolean;
  faqs?: { question: string; answer: string }[];
};

function mapPost(row: any): Post {
  if (!row) return row;
  return {
    ...row,
    reads: row.reads ?? 0,
    reads_per_day: row.reads_per_day ?? 12,
    reads_started_at: row.reads_started_at ?? null,
    has_toc: row.has_toc ?? true,
    faqs: row.faqs ?? [],
  };
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const supabase = createSupabaseClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  return mapPost(data);
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return mapPost(data);
}

export async function createPost(input: PostInput & { slug: string }): Promise<Post> {
  const supabase = createSupabaseAdmin();
  const baseInsert: Record<string, any> = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    author: input.author,
    category: input.category ?? "Dental Health",
    cover_image: input.cover_image ?? null,
    published: input.published ?? false,
    featured: input.featured ?? false,
    meta_title: input.meta_title ?? null,
    meta_description: input.meta_description ?? null,
    meta_keywords: input.meta_keywords ?? null,
    published_at: input.published_at !== undefined ? input.published_at : (input.published ? new Date().toISOString() : null),
    updated_at: new Date().toISOString(),
  };

  const fullInsert = {
    ...baseInsert,
    reads: input.reads ?? 0,
    reads_per_day: input.reads_per_day ?? 12,
    reads_started_at: new Date().toISOString(),
    has_toc: input.has_toc ?? true,
    faqs: input.faqs ?? [],
  };

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert(fullInsert)
      .select()
      .single();
    if (error) {
      if (
        error.code === "42703" ||
        error.message?.includes("reads") ||
        error.message?.includes("toc") ||
        error.message?.includes("faq")
      ) {
        console.warn("Newer columns missing in Supabase, retrying insert without them...");
        const { data: retryData, error: retryError } = await supabase
          .from("posts")
          .insert(baseInsert)
          .select()
          .single();
        if (retryError) throw retryError;
        return mapPost(retryData);
      }
      throw error;
    }
    return mapPost(data);
  } catch (err: any) {
    if (
      err.code === "42703" ||
      err.message?.includes("reads") ||
      err.message?.includes("toc") ||
      err.message?.includes("faq")
    ) {
      const { data, error } = await supabase
        .from("posts")
        .insert(baseInsert)
        .select()
        .single();
      if (error) throw error;
      return mapPost(data);
    }
    throw err;
  }
}

export async function updatePost(id: string, input: Partial<PostInput & { slug: string }>) {
  const supabase = createSupabaseAdmin();
  const existing = await getPostByIdAdmin(id);
  
  const baseUpdate: Record<string, any> = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  if (input.published === true && existing && !existing.published && !input.published_at) {
    baseUpdate.published_at = new Date().toISOString();
  }

  // Extract reads, has_toc, and faqs to only send them if they are supported
  const readsUpdate: Record<string, any> = {};
  
  if (existing) {
    const currentDisplayReads = getDisplayReads(existing);
    const rateChanged = input.reads_per_day !== undefined && input.reads_per_day !== existing.reads_per_day;
    
    if (rateChanged) {
      readsUpdate.reads = input.reads !== undefined ? input.reads : currentDisplayReads;
      readsUpdate.reads_per_day = input.reads_per_day;
      readsUpdate.reads_started_at = new Date().toISOString();
    } else {
      if (input.reads_per_day !== undefined) {
        readsUpdate.reads_per_day = input.reads_per_day;
      }
      if (input.reads !== undefined && input.reads !== currentDisplayReads) {
        readsUpdate.reads = input.reads;
        readsUpdate.reads_started_at = new Date().toISOString();
      }
    }
  } else {
    if (input.reads !== undefined) {
      readsUpdate.reads = input.reads;
      readsUpdate.reads_started_at = new Date().toISOString();
    }
    if (input.reads_per_day !== undefined) {
      readsUpdate.reads_per_day = input.reads_per_day;
    }
  }

  if (input.has_toc !== undefined) {
    readsUpdate.has_toc = input.has_toc;
  }
  if (input.faqs !== undefined) {
    readsUpdate.faqs = input.faqs;
  }

  delete baseUpdate.reads;
  delete baseUpdate.reads_per_day;
  delete baseUpdate.reads_started_at;
  delete baseUpdate.has_toc;
  delete baseUpdate.faqs;

  const fullUpdate = {
    ...baseUpdate,
    ...readsUpdate,
  };

  try {
    const { data, error } = await supabase
      .from("posts")
      .update(fullUpdate)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      if (
        error.code === "42703" ||
        error.message?.includes("reads") ||
        error.message?.includes("toc") ||
        error.message?.includes("faq")
      ) {
        console.warn("Newer columns missing in Supabase, retrying update without them...");
        const { data: retryData, error: retryError } = await supabase
          .from("posts")
          .update(baseUpdate)
          .eq("id", id)
          .select()
          .single();
        if (retryError) throw retryError;
        return mapPost(retryData);
      }
      throw error;
    }
    return mapPost(data);
  } catch (err: any) {
    if (
      err.code === "42703" ||
      err.message?.includes("reads") ||
      err.message?.includes("toc") ||
      err.message?.includes("faq")
    ) {
      const { data, error } = await supabase
        .from("posts")
        .update(baseUpdate)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return mapPost(data);
    }
    throw err;
  }
}

export async function deletePost(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllPostSlugs(): Promise<
  { slug: string; updated_at: string; published_at: string | null }[]
> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("published", true);
  if (error) throw error;
  return (data ?? []) as { slug: string; updated_at: string; published_at: string | null }[];
}

export async function getPageSeo(pagePath: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("page_path", pagePath)
    .single();
  if (error) return null;
  return data as PageSeo;
}

export async function getAllPageSeo() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .order("page_path");
  if (error) throw error;
  return (data ?? []) as PageSeo[];
}

export async function upsertPageSeo(
  pagePath: string,
  meta: { meta_title: string; meta_description: string; meta_keywords?: string }
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("page_seo")
    .upsert(
      {
        page_path: pagePath,
        ...meta,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_path" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as PageSeo;
}

export async function subscribeNewsletter(email: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return { duplicate: true };
    throw error;
  }
  return { duplicate: false, data };
}

export async function getNewsletterSubscribers(): Promise<
  { id: string; email: string; subscribed_at: string }[]
> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}

export async function markContactRead(id: string, read: boolean) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

export async function createWriteForUsSubmission(input: {
  name: string;
  email: string;
  topic: string;
  bio?: string;
  sample_url?: string;
  message: string;
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("write_for_us_submissions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getWriteForUsSubmissions(): Promise<WriteForUsSubmission[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("write_for_us_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as WriteForUsSubmission[];
}

export async function updateWriteForUsStatus(id: string, status: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("write_for_us_submissions")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) return null;
  return data as User;
}

export async function getAdminStats() {
  const supabase = createSupabaseAdmin();
  const [posts, subscribers, messages, writeForUs] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabase.from("write_for_us_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return {
    posts: posts.count ?? 0,
    subscribers: subscribers.count ?? 0,
    unreadMessages: messages.count ?? 0,
    pendingWriteForUs: writeForUs.count ?? 0,
  };
}
