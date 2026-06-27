import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  console.log("Supabase URL:", supabaseUrl);
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing SUPABASE env variables");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.from("posts").select("*").limit(1);
  if (error) {
    console.error("Error fetching posts:", error);
  } else {
    console.log("Sample post keys:", data && data[0] ? Object.keys(data[0]) : "No posts found");
    console.log("Sample post data:", data && data[0] ? data[0] : null);
  }
}

main();
