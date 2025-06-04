import { Client } from "pg";

export async function testConnection(dbUrl: string): Promise<void> {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.query("SELECT 1");
  } finally {
    await client.end();
  }
}
