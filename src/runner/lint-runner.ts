import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";
import { AdvisorFinding } from "../types/advisor-finding";

export async function runAllLints(client: Client): Promise<AdvisorFinding[]> {
  const dir = path.resolve(__dirname, "..", "lints");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const findings: AdvisorFinding[] = [];

  for (const file of files) {
    let sql = await readFile(path.join(dir, file), "utf8");
    // Remove 'create view ... as' (case-insensitive, multiline)
    sql = sql.replace(/^create\s+view\s+.*?\s+as\s+/is, "").trim();
    // Remove trailing semicolon if present
    if (sql.endsWith(";")) sql = sql.slice(0, -1);
    try {
      const rows = await client.query(sql).then((r) => r.rows);
      rows.forEach((r) =>
        findings.push({
          check_id: file.replace(".sql", ""),
          severity: (r.level || "warning").toLowerCase(),
          object:
            r.object_name ||
            r.relname ||
            r.proname ||
            (r.metadata && r.metadata.name ? r.metadata.name : "") ||
            "",
          message: r.detail || r.message || "see description",
        })
      );
    } catch (err: any) {
      console.warn(`Skipping ${file}: ${err.message}`);
    }
  }
  return findings;
}
