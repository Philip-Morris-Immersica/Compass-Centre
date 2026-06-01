import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Pooler URL-ите с `-pooler` блокират DDL; ползваме директен URL без pooler.
const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) { console.error("DATABASE_URL not set"); process.exit(1); }

const directUrl = rawUrl
  .replace("-pooler.", ".")                  // Премахва pooler суфикса
  .replace("&channel_binding=require", "")   // Маха channel_binding (pooler параметър)
  .replace("?channel_binding=require&", "?"); // Или ако е в началото

console.log("Connecting to:", directUrl.replace(/:([^@]+)@/, ":***@"));

const sql = neon(directUrl);

async function main() {
  console.log("Running manual migrations...\n");

  await sql`
    ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS state text
  `;
  console.log("✓ conversations.state column");

  await sql`
    CREATE TABLE IF NOT EXISTS scenarios (
      id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        varchar(100) NOT NULL UNIQUE,
      title       varchar(300) NOT NULL,
      category    varchar(100) NOT NULL DEFAULT '',
      scope       text NOT NULL DEFAULT '',
      goal        text NOT NULL DEFAULT '',
      approach    text NOT NULL DEFAULT '',
      behavior    text NOT NULL DEFAULT '',
      knowledge   text NOT NULL DEFAULT '',
      resources   text NOT NULL DEFAULT '',
      enabled     boolean NOT NULL DEFAULT true,
      sort_order  integer NOT NULL DEFAULT 0,
      created_at  timestamp NOT NULL DEFAULT now(),
      updated_at  timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log("✓ scenarios table");

  console.log("\nMigration complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
