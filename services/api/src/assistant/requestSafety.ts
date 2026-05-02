/**
 * Simple dependency-free request safety classifier for the assistant.
 */

export type AssistantRequestSafetyCategory =
  | "safe_shell"
  | "cannot_verify_procedural"
  | "neutral_refusal_political";

export function classifyAssistantRequest(question: string): AssistantRequestSafetyCategory {
  const q = question.toLowerCase();

  // 1. Political signals
  if (
    q.includes("party") || 
    q.includes("candidate") || 
    q.includes("vote for") || 
    q.includes("who to support") ||
    q.includes("bjp") ||
    q.includes("congress") ||
    q.includes("aap")
  ) {
    return "neutral_refusal_political";
  }

  // 2. Procedural signals
  if (
    q.includes("register") || 
    q.includes("registration") || 
    q.includes("deadline") || 
    q.includes("eligible") || 
    q.includes("eligibility") ||
    q.includes("form 6") ||
    q.includes("polling") ||
    q.includes("voter id") ||
    q.includes("voter list") ||
    q.includes("where do i vote") ||
    q.includes("how do i vote") ||
    q.includes("can i vote")
  ) {
    return "cannot_verify_procedural";
  }

  // 3. Safe shell signals
  if (
    q.includes("can voteready india answer") ||
    q.includes("status") ||
    q.includes("ready")
  ) {
    return "safe_shell";
  }

  return "safe_shell";
}
