import fs from "fs";
import path from "path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL to your Supabase Postgres connection string.");
  console.error("Supabase Dashboard > Project Settings > Database > Connection string (URI)");
  process.exit(1);
}

const sql = postgres(url, { ssl: "require" });
const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

try {
  await sql.unsafe(schema);
  console.log("Schema applied successfully!");
} catch (e) {
  console.error("Setup failed:", e);
  process.exit(1);
} finally {
  await sql.end();
}
