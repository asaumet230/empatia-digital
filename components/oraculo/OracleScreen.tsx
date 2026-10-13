"use client";

import dynamic from "next/dynamic";

/**
 * The session lives in sessionStorage, which only exists in the browser: rendering the flow on
 * the client only avoids a server/browser mismatch and a flash of the wrong screen.
 */
export const OracleScreen = dynamic(() => import("@/components/oraculo/OracleApp"), {
  ssr: false,
  loading: () => <div className="min-h-dvh" aria-busy="true" />,
});
