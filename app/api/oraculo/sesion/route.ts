import { z } from "zod";
import { postHandler } from "@/lib/oraculo/http";
import { getOracle } from "@/lib/oraculo/servidor";
import { ProfileSchema } from "@/lib/oraculo/tipos";

/** Starts a session for the chosen profile and returns its signed pass. */
export const POST = postHandler(z.object({ profile: ProfileSchema }), ({ profile }) => getOracle().start(profile));
