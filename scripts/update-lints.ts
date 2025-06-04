import { promises as fs } from "fs";
import path from "path";

const GITHUB_API =
  "https://api.github.com/repos/supabase/splinter/contents/lints";
const RAW_BASE =
  "https://raw.githubusercontent.com/supabase/splinter/main/lints/";
const LOCAL_LINTS_DIR = path.resolve(__dirname, "../src/lints");

async function fetchLintsList() {
  const res = await fetch(GITHUB_API);
  if (!res.ok) throw new Error(`Failed to fetch lints list: ${res.statusText}`);
  const files = (await res.json()) as any[];
  return files
    .filter((f: any) => f.name.endsWith(".sql"))
    .map((f: any) => f.name);
}

async function downloadAndSaveLint(file: string) {
  const url = RAW_BASE + file;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.statusText}`);
  const sql = await res.text();
  await fs.writeFile(path.join(LOCAL_LINTS_DIR, file), sql, "utf8");
  console.log(`Downloaded: ${file}`);
}

async function main() {
  await fs.mkdir(LOCAL_LINTS_DIR, { recursive: true });
  const lints = await fetchLintsList();
  for (const file of lints) {
    await downloadAndSaveLint(file);
  }
  console.log("✅ All lints updated from Splinter.");
}

main().catch((err) => {
  console.error("Error updating lints:", err);
  process.exit(1);
});
