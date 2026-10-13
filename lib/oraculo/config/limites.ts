/** Session limits. A session ends at whichever comes first. */
export const LIMITS = {
  /** Messages the person can send in one session. */
  maxUserMessages: 30,
  /** Session length, from the moment it starts. */
  maxSessionMinutes: 60,
  /** Characters per message: enough to tell what happened, too little to paste long injections. */
  maxMessageChars: 1000,
  /**
   * Token budget per model call. It also covers the model's internal reasoning, so it is well
   * above the length of a reply; the prompts keep the visible answer short.
   */
  maxOutputTokens: 1500,
  /** Longest history (both sides) the server accepts back from the browser. */
  maxHistoryMessages: 61,
  /** Time we wait for OpenAI before giving up on a request. */
  requestTimeoutMs: 20_000,
  /** Extra attempts after a failed OpenAI call. */
  maxRetries: 1,
} as const;
