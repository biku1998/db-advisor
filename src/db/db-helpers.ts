import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export async function getClient(url?: string) {
  const client = new Client({
    connectionString: url || process.env.DATABASE_URL,
  });
  await client.connect();
  return client;
}

export async function runSql(
  client: Client,
  sql: string,
  params: unknown[] = []
) {
  const { rows } = await client.query(sql, params);
  return rows;
}
