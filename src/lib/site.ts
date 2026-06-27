export const siteConfig = {
  name: "DentalJournal.online",
  tagline: "Expert dental health articles for everyday smiles",
  url: "https://dentaljournal.online",
  email: "hello@dentaljournal.online",
  twitter: "@dentaljournal",
  locale: "en_US",
};

export const defaultKeywords = [
  "dental blog",
  "oral health",
  "dental care tips",
  "dentistry articles",
  "dental health",
];

export const staticPages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/write-for-us", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
];

export const defaultPageSeo: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  "/": {
    title: "DentalJournal.online | Dental Health Blog & Expert Articles",
    description:
      "Read expert dental health articles, oral care tips, and patient-friendly guides written by dental professionals.",
    keywords: "dental blog, oral health, dental care tips, dentistry articles",
  },
  "/blog": {
    title: "Articles | DentalJournal.online",
    description:
      "Browse our latest dental health articles, oral hygiene guides, and expert dental advice.",
    keywords: "dental articles, oral health blog, dental tips",
  },
  "/about": {
    title: "About Us | DentalJournal.online",
    description:
      "Learn about DentalJournal.online — a trusted dental health blog sharing practical advice for patients and professionals.",
    keywords: "about dental blog, dental health writers",
  },
  "/contact": {
    title: "Contact | DentalJournal.online",
    description:
      "Get in touch with the DentalJournal.online team for questions, partnerships, or feedback.",
    keywords: "contact dental blog",
  },
  "/write-for-us": {
    title: "Write For Us | DentalJournal.online",
    description:
      "Contribute dental health articles to DentalJournal.online. Submit your story idea and join our writer community.",
    keywords: "write for us dental, guest post dentistry",
  },
  "/faq": {
    title: "Frequently Asked Questions | DentalJournal.online",
    description:
      "Find answers to common questions about dental care routines, article contributions, and medical disclaimers.",
    keywords: "dental faq, oral health questions, dentist faq",
  },
  "/privacy": {
    title: "Privacy Policy | DentalJournal.online",
    description:
      "Understand how DentalJournal.online collects, uses, and protects your personal information.",
    keywords: "privacy policy dental blog",
  },
  "/terms": {
    title: "Terms of Service | DentalJournal.online",
    description:
      "Read the terms of service and professional content disclaimers for DentalJournal.online.",
    keywords: "terms of service dental blog, medical disclaimer",
  },
};
