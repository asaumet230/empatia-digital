import { z } from "zod";
import { HistorySchema, postHandler, TokenSchema } from "@/lib/oraculo/http";
import { getOracle } from "@/lib/oraculo/servidor";

export const maxDuration = 30;

/** Ends the session with a summary to copy or print. */
export const POST = postHandler(z.object({ token: TokenSchema, history: HistorySchema }), (body) =>
  getOracle().close(body),
);
