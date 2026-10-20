"use client";

import dynamic from "next/dynamic";
import { OracleSplash } from "@/components/oraculo/OracleSplash";

/**
 * The session lives in sessionStorage, which only exists in the browser: rendering the flow on
 * the client only avoids a server/browser mismatch and a flash of the wrong screen.
 */
export const OracleScreen = dynamic(() => import("@/components/oraculo/OracleApp"), {
  ssr: false,
  loading: () => <OracleSplash />,
});
