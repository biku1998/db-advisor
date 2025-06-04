# db-advisor

## Overview

**db-advisor** is a cross-platform, TypeScript-based CLI tool that connects to any Postgres database and produces an actionable, advisor-style report—similar to Supabase's Security & Performance Advisors. It leverages open-source lints from the [Splinter](https://github.com/supabase/splinter) project to flag common security, performance, and schema issues, and exports the results as a CSV for easy review and triage.

---

## Problem Statement

Modern Postgres databases, especially those exposed to the internet or used in SaaS environments, are prone to subtle misconfigurations and anti-patterns that can lead to:

- Security vulnerabilities (e.g., missing RLS, exposed auth tables)
- Performance bottlenecks (e.g., missing indexes, table bloat)
- Maintainability issues (e.g., no primary keys, duplicate indexes)

**Manual review is error-prone and time-consuming.**  
There is a need for an automated, repeatable, and extensible tool that can:

- Connect to any Postgres instance (including Supabase, RDS, etc.)
- Run a comprehensive suite of lints and best-practice checks
- Output results in a format suitable for CI, audits, or human review

---

## Solution Approach

### Key Design Principles

- **Read-only, safe by default:**  
  The tool only issues `SELECT` queries—no schema or data changes are made.
- **Modular and extensible:**  
  Lints are managed as standalone SQL files, making it easy to add, update, or remove checks.
- **Modern TypeScript architecture:**  
  The codebase is organized for clarity, testability, and future growth.
- **Actionable output:**  
  Results are exported as a CSV, with severity, object, and detailed advice for each finding.

---

## How It Works

1. **Connects to your Postgres database** using a connection string or environment variable.
2. **Downloads and runs all lints** from the Splinter project (or your own custom lints) as raw SQL `SELECT` statements.
3. **Parses and normalizes the results** into a unified format, extracting severity, object, and message.
4. **Exports findings to a CSV file** for easy review, sharing, or integration with other tools.

---

## Project Structure

```txt
src/
  cli-entry.ts              # CLI entrypoint
  cli/
    cli-main.ts             # Main CLI logic (argument parsing, orchestration)
  db/
    db-helpers.ts           # Database connection and query helpers
  runner/
    lint-runner.ts          # Loads and runs all lints, normalizes results
  report/
    csv-writer.ts           # Writes findings to CSV
    ai-summary.ts           # (Optional) Generates AI remediation summary
  types/
    advisor-finding.ts      # Shared TypeScript types for findings
  lints/
    *.sql                   # Lint SQL files (from Splinter or custom)
```

---

## Tools & Libraries Used

- **TypeScript**: Type safety and maintainability.
- **pg**: PostgreSQL client for Node.js.
- **commander**: CLI argument parsing.
- **dotenv**: Environment variable management.
- **node-fetch**: For downloading lints from GitHub (if auto-updating).
- **openai**: (Optional) For generating AI-powered remediation summaries.
- **fs/promises**: Native Node.js file I/O for CSV writing.
- **Splinter lints**: Community-driven SQL lint rules.

---

## Why These Tools?

- **TypeScript** ensures robust, maintainable code and clear contracts between modules.
- **pg** is the de facto standard for Postgres in Node.js, providing reliable and performant DB access.
- **commander** offers a mature, user-friendly CLI experience.
- **Splinter lints** are open-source, well-maintained, and cover a wide range of real-world Postgres issues.
- **CSV output** is universally compatible and easy to process in CI, Excel, or other tools.

---

## Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Update lints (optional, recommended)

```bash
npm run update-lints
```

### 3. Set your database URL

- In a `.env` file:

  ```sh
  DATABASE_URL=postgres://user:pass@host:port/db
  ```

- Or pass via CLI:

  ```bash
  npx ts-node src/cli-entry.ts --db "postgres://user:pass@host:port/db"
  ```

### 4. Run the advisor

```bash
npx ts-node src/cli-entry.ts --db "$DATABASE_URL" --out advisor.csv
```

### 5. Review the output

- Open `advisor.csv` in your favorite spreadsheet tool or CI system.

---

## Sample Output

Below is a sample of the generated CSV output, as rendered in a table:

| Check ID                    | Severity | Object             | Message                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------- | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001_unindexed_foreign_keys | info     | announcement_users | Table `public.announcement_users` has a foreign key `announcement_users_updated_by_fkey` without a covering index. This can lead to suboptimal query performance.                                                                                                                                                                                                                                                                     |
| 0003_auth_rls_initplan      | warn     | client_users       | Table `public.client_users` has a row level security policy `all_client_users_can_read` that re-evaluates current_setting() or auth.<function>() for each row. This produces suboptimal query performance at scale. Resolve the issue by replacing `auth.<function>()` with `(select auth.<function>())`. See [docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select) for more info. |
| 0010_security_definer_view  | error    | my_view            | View `public.my_view` is defined with the SECURITY DEFINER property                                                                                                                                                                                                                                                                                                                                                                   |

<!--
Add a screenshot of the generated CSV file here if desired.
Example:
![Advisor CSV Output](./screenshots/advisor-sample.png)
-->

---

## Security & Permissions

- **Read-only:**  
  The tool only requires `SELECT` privileges on your database. No data or schema changes are made.
- **Safe for production:**  
  No DDL or DML is executed.

---

## Extending & Customizing

- **Add your own lints:**  
  Drop additional `.sql` files into `src/lints/`.
- **Customize output:**  
  Modify `csv-writer.ts` to add columns or change formatting.
- **Integrate with CI:**  
  Use the CLI in your pipeline to gate deployments on critical findings.

---

## Contributing

- PRs and issues are welcome!  
  Please see the code structure and follow the established conventions for new lints or features.

---

## Acknowledgements

- [Supabase Splinter](https://github.com/supabase/splinter) for the open-source lints and inspiration.
- The Postgres community for best practices and guidance.

---

## License

MIT
