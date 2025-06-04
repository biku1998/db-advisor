import { Client } from "pg";

export interface AdvisorFinding {
  table: string;
  issue: string;
  recommendation: string;
}

export async function runAdvisors(client: Client): Promise<AdvisorFinding[]> {
  // Placeholder: Find tables without RLS enabled
  const findings: AdvisorFinding[] = [];
  const res = await client.query(`
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  `);
  for (const row of res.rows) {
    const rlsRes = await client.query(
      `SELECT relrowsecurity FROM pg_class WHERE relname = $1`,
      [row.tablename]
    );
    if (!rlsRes.rows[0]?.relrowsecurity) {
      findings.push({
        table: `${row.schemaname}.${row.tablename}`,
        issue: "RLS not enabled",
        recommendation: "Enable Row Level Security (RLS) for this table.",
      });
    }
  }
  return findings;
}
