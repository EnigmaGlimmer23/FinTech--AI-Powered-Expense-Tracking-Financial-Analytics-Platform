import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "fintech",
  name: "FinTech",

  // Was "retryFuncation" (typo) — the Inngest SDK ignored the unrecognized
  // key and silently fell back to its default retry policy, so this custom
  // backoff/attempt-limit config was never actually applied (BUG-011).
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
    maxAttempts: 2,
  }),
});
