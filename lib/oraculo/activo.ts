/**
 * Launch switch. Until the Oráculo is approved it stays hidden: no floating button, no chat page
 * and no API. `ORACULO_ACTIVO=true` turns it on (in `.env.local` to work on it, in Vercel plus a
 * redeploy to launch it); `false`, or no value, keeps it hidden. The legal pages stay public: the
 * site's own policy and terms link to them.
 */
export const ORACLE_ENABLED = process.env.ORACULO_ACTIVO?.trim().toLowerCase() === "true";
