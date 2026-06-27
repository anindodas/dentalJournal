import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function main() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.from("posts").select("*").limit(1);
  if (error) {
    console.error("Error fetching posts:", error);
  } else {
    console.log("Supabase post columns:", data && data[0] ? Object.keys(data[0]) : "No posts found");
  }
}

main();
