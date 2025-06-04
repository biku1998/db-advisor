#!/usr/bin/env node
import { Command } from "commander";
import { getClient } from "../db/db-helpers";
import { runAllLints } from "../runner/lint-runner";
import { writeCsv } from "../report/csv-writer";
import { getAISummary } from "../report/ai-summary";

const program = new Command();
program
  .requiredOption("-d, --db <url>", "Postgres connection string")
  .option("-o, --out <file>", "CSV output", "advisor.csv")
  .option("--summary", "include AI remediation sheet")
  .parse(process.argv);

(async () => {
  const { db, out, summary } = program.opts();
  const client = await getClient(db);

  const findings = await runAllLints(client);

  // let aiText = '';
  // if (summary) {
  //   console.log('🔮  Generating AI summary…');
  //   aiText = await getAISummary(findings);
  // }
  await writeCsv(findings, out /*, aiText*/);
  await client.end();
})();
