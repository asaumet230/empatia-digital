/** Session limits. A session ends at whichever comes first. */
export const LIMITS = {
  /** Messages the person can send in one session. */
  maxUserMessages: 30,
  /** Session length, from the moment it starts. */
  maxSessionMinutes: 60,
  /** Characters per message: enough to tell what happened, too little to paste long injections. */
  maxMessageChars: 1000,
  /** Upper bound for each Oráculo reply; replies are meant to be short. */
  maxReplyTokens: 400,
  /** Time we wait for OpenAI before giving up on a request. */
  requestTimeoutMs: 20_000,
  /** Extra attempts after a failed OpenAI call. */
  maxRetries: 1,
} as const;
