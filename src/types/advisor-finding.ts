export interface AdvisorFinding {
  check_id: string;
  severity: "error" | "warning" | "info";
  object: string;
  message: string;
}
