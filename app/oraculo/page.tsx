import { notFound } from "next/navigation";
import { OracleScreen } from "@/components/oraculo/OracleScreen";
import { ORACLE_ENABLED } from "@/lib/oraculo/activo";

export default function OraculoPage() {
  if (!ORACLE_ENABLED) notFound();
  return <OracleScreen />;
}
