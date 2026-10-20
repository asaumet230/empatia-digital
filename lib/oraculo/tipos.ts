import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Oráculo — shared contracts. The zod schemas are the source of      */
/*  truth: the server validates everything that crosses a boundary     */
/*  (browser → API, OpenAI → API) against them.                        */
/* ------------------------------------------------------------------ */

/** Who is talking. Chosen on the first screen; it picks the prompt and the safety policy. */
export const PROFILES = ["estudiante", "docente", "familia"] as const;
export const ProfileSchema = z.enum(PROFILES);
export type Profile = z.infer<typeof ProfileSchema>;

/** Students get the protective flow; teachers and families get guidance on how to act. */
export type Audience = "estudiante" | "adulto";
export const audienceOf = (profile: Profile): Audience => (profile === "estudiante" ? "estudiante" : "adulto");

/** Risk levels, from "within scope" to "possible immediate danger". */
export const RISK_LEVELS = ["SAFE", "REVIEW", "HIGH_RISK", "IMMEDIATE_DANGER"] as const;
export const RiskLevelSchema = z.enum(RISK_LEVELS);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

/** What kind of risk was detected; each one has its own safety message and help lines. */
export const RISK_CATEGORIES = ["ninguna", "autolesion", "abuso", "violencia", "extorsion", "acoso_grave"] as const;
export const RiskCategorySchema = z.enum(RISK_CATEGORIES);
export type RiskCategory = z.infer<typeof RiskCategorySchema>;

/** Which fixed safety message applies: one per risk category, plus "possible immediate danger". */
export const SAFETY_KEYS = [
  "peligro_inmediato",
  "autolesion",
  "abuso",
  "violencia",
  "extorsion",
  "acoso_grave",
] as const satisfies readonly (Exclude<RiskCategory, "ninguna"> | "peligro_inmediato")[];
export const SafetyKeySchema = z.enum(SAFETY_KEYS);
export type SafetyKey = z.infer<typeof SafetyKeySchema>;

/** Structured answer of the risk layer. A serious level always names what kind of risk it is. */
export const RiskAssessmentSchema = z
  .object({
    level: RiskLevelSchema,
    category: RiskCategorySchema,
    /** Short internal reason. Never shown to the user and never logged with the message. */
    reason: z.string().max(300),
  })
  .refine((r) => (r.level === "SAFE") === (r.category === "ninguna") || r.level === "REVIEW", {
    message: "SAFE va con 'ninguna'; HIGH_RISK e IMMEDIATE_DANGER necesitan una categoría",
  });
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;

/** Optional nickname the person chose: letters only, up to three words, so it can never carry instructions. */
export const AliasSchema = z
  .string()
  .max(20)
  .regex(/^\p{L}+( \p{L}+){0,2}$/u);
export type Alias = z.infer<typeof AliasSchema>;

export const MessageSchema = z.object({
  role: z.enum(["usuario", "oraculo"]),
  text: z.string().min(1).max(4000),
});
export type Message = z.infer<typeof MessageSchema>;
