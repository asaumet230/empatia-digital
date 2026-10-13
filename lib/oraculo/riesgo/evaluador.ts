import type { Message, Profile, RiskAssessment } from "@/lib/oraculo/tipos";

/** Anything that can judge the risk of the latest message, given the conversation so far. */
export interface RiskChecker {
  assess(input: { profile: Profile; history: readonly Message[] }): Promise<RiskAssessment>;
}
