import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const url = process.env.DATABASE_URL
  .replace("-pooler.", ".")
  .replace("&channel_binding=require", "");

const sql = neon(url);
const rows = await sql`SELECT key, LEFT(value, 80) as preview FROM config ORDER BY key`;
console.log("Config table:");
rows.forEach(r => console.log(" ", r.key, "=", r.preview + (r.preview.length >= 80 ? "..." : "")));
