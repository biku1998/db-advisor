import { AdvisorFinding } from "../types/advisor-finding";
import { promises as fs } from "fs";

export async function writeCsv(findings: AdvisorFinding[], outFile: string) {
  const headers = ["Check ID", "Severity", "Object", "Message"];
  const rows = findings.map((f) => [
    f.check_id,
    f.severity,
    f.object,
    f.message,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  await fs.writeFile(outFile, csv, "utf8");
  console.log(`✅  CSV written to ${outFile}`);
}
