import type { RiskChecker } from "@/lib/oraculo/riesgo/evaluador";
import { RISK_LEVELS, type RiskAssessment } from "@/lib/oraculo/tipos";

const severity = (a: RiskAssessment) => RISK_LEVELS.indexOf(a.level);

/** The most serious of several assessments. On a tie, the one that names a category wins. */
export function mostSevere(assessments: readonly RiskAssessment[]): RiskAssessment {
  return assessments.reduce((worst, a) =>
    severity(a) > severity(worst) || (severity(a) === severity(worst) && worst.category === "ninguna") ? a : worst,
  );
}

/**
 * Runs several checkers side by side and keeps the most serious answer: if one misses a danger,
 * another can catch it. If some fail, the rest still decide, but the result is never better
 * than REVIEW. If all fail, the error goes up and the message gets no reply.
 */
export class CombinedRiskChecker implements RiskChecker {
  constructor(private readonly checkers: readonly RiskChecker[]) {}

  async assess(input: Parameters<RiskChecker["assess"]>[0]) {
    const settled = await Promise.allSettled(this.checkers.map((c) => c.assess(input)));
    const done = settled.flatMap((s) => (s.status === "fulfilled" ? [s.value] : []));
    if (done.length === 0) throw (settled[0] as PromiseRejectedResult).reason;

    const result = mostSevere(done);
    if (done.length < settled.length && result.level === "SAFE") {
      return { level: "REVIEW", category: "ninguna", reason: "un evaluador falló" } satisfies RiskAssessment;
    }
    return result;
  }
}
