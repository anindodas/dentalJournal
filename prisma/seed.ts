import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@journaldental.com" },
    update: {},
    create: {
      email: "admin@journaldental.com",
      password,
      name: "Journal Admin",
      role: "admin",
    },
  });

  await prisma.announcement.deleteMany();
  await prisma.post.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.editorialMember.deleteMany();

  await prisma.announcement.createMany({
    data: [
      {
        title: "Call for Papers: Volume 2026",
        content:
          "We invite researchers, dental professionals, and scholars to submit their original research papers, reviews, and case studies for the upcoming issue of Journal Dental Pro.",
        link: "/submissions",
        published: true,
      },
      {
        title: "Current Issue Released",
        content:
          "Volume 1 (2026) has been published. Explore the latest research in dental sciences and oral health innovation.",
        link: "/issues",
        published: true,
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Advances in Minimally Invasive Restorative Dentistry",
        slug: "advances-minimally-invasive-restorative-dentistry",
        excerpt:
          "A comprehensive review of modern techniques in minimally invasive restorative procedures and their clinical outcomes.",
        content:
          "<p>Minimally invasive dentistry represents a paradigm shift in how clinicians approach restorative care.</p>",
        author: "Dr. Sarah Mitchell",
        category: "Research",
        published: true,
        featured: true,
        publishedAt: new Date("2026-03-15"),
      },
      {
        title: "Digital Workflow Integration in Implant Planning",
        slug: "digital-workflow-implant-planning",
        excerpt:
          "How CBCT-guided planning and 3D printing are transforming precision in dental implantology.",
        content:
          "<p>Digital dentistry has revolutionized implant planning through integrated workflows.</p>",
        author: "Prof. James Chen",
        category: "Technology",
        published: true,
        featured: true,
        publishedAt: new Date("2026-02-20"),
      },
      {
        title: "Periodontal Regeneration: Current Evidence and Future Directions",
        slug: "periodontal-regeneration-evidence",
        excerpt:
          "An analysis of regenerative therapies for periodontal tissue and emerging biomaterial applications.",
        content:
          "<p>Periodontal regeneration remains one of the most challenging areas in dental medicine.</p>",
        author: "Dr. Elena Rodriguez",
        category: "Review",
        published: true,
        featured: false,
        publishedAt: new Date("2026-01-10"),
      },
    ],
  });

  await prisma.issue.create({
    data: {
      volume: 1,
      number: 1,
      year: 2026,
      title: "Volume 1, Issue 1 (2026)",
      description:
        "The inaugural issue featuring groundbreaking research in restorative dentistry, implantology, and periodontal science.",
      published: true,
      publishedAt: new Date("2026-04-01"),
    },
  });

  await prisma.editorialMember.createMany({
    data: [
      {
        name: "Dr. Michael Thompson",
        role: "Editor-in-Chief",
        title: "Professor of Oral Biology, University of Dental Sciences",
        bio: "Dr. Thompson has over 25 years of experience in dental research.",
        email: "editor@journaldental.com",
        order: 1,
      },
      {
        name: "Dr. Priya Sharma",
        role: "Associate Editor",
        title: "Director, Center for Dental Innovation",
        bio: "Specializing in digital dentistry and biomaterials research.",
        order: 2,
      },
      {
        name: "Dr. Robert Williams",
        role: "Managing Editor",
        title: "Senior Research Fellow",
        bio: "Oversees peer review processes and editorial standards.",
        order: 3,
      },
      {
        name: "Dr. Anna Kowalski",
        role: "Editorial Board Member",
        title: "Professor of Periodontology",
        order: 4,
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("Admin login: admin@journaldental.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
