export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string;
  category: string;
  published: boolean;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  reads: number;
  reads_per_day: number;
  reads_started_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PageSeo = {
  id: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type WriteForUsSubmission = {
  id: string;
  name: string;
  email: string;
  topic: string;
  bio: string | null;
  sample_url: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed_at: string;
};

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: {
          title: string;
          slug: string;
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
          reads_started_at?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Post>;
      };
      page_seo: {
        Row: PageSeo;
        Insert: {
          page_path: string;
          meta_title: string;
          meta_description: string;
          meta_keywords?: string | null;
          updated_at?: string;
        };
        Update: Partial<PageSeo>;
      };
      users: {
        Row: User;
        Insert: {
          email: string;
          password_hash: string;
          name?: string;
          role?: string;
        };
        Update: Partial<User>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: { email: string };
        Update: { email?: string };
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
        };
        Update: Partial<ContactMessage>;
      };
      write_for_us_submissions: {
        Row: WriteForUsSubmission;
        Insert: {
          name: string;
          email: string;
          topic: string;
          bio?: string | null;
          sample_url?: string | null;
          message: string;
          status?: string;
        };
        Update: Partial<WriteForUsSubmission>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
