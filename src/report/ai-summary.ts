import { OpenAI } from "openai";
import { AdvisorFinding } from "../types/advisor-finding";

export async function getAISummary(findings: AdvisorFinding[]) {
  const openai = new OpenAI(); // uses OPENAI_API_KEY env var
  const prompt = `
You are a senior Postgres consultant.
Given the following findings, write a concise remediation guide (max 500 words).
${JSON.stringify(findings.slice(0, 50)).slice(0, 8000)}
  `;
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return resp.choices[0].message.content ?? "";
}
