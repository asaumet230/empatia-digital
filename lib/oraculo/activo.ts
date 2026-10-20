/**
 * Launch switch. Until the Oráculo is approved, production hides the floating button, the chat page
 * and its API: set `ORACULO_ACTIVO=true` in Vercel and redeploy to turn it on (`false`, or no value,
 * keeps it hidden). Always on with `npm run dev`, so it can still be built and tried locally. The
 * legal pages stay public: the site's own policy and terms link to them.
 */
export const ORACLE_ENABLED =
  process.env.ORACULO_ACTIVO?.trim().toLowerCase() === "true" || process.env.NODE_ENV === "development";
