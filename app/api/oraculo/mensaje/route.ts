import { z } from "zod";
import { HistorySchema, postHandler, TokenSchema } from "@/lib/oraculo/http";
import { getOracle } from "@/lib/oraculo/servidor";

// Risk check + reply, each with its own timeout and one retry.
export const maxDuration = 60;

/** One message: risk check, then a reply or the safety panel. */
export const POST = postHandler(
  z.object({ token: TokenSchema, history: HistorySchema, text: z.string().max(5_000) }),
  (body) => getOracle().send(body),
);
