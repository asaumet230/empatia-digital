import type { Metadata } from "next";
import { Presentation } from "@/components/presentation/Presentation";

export const metadata: Metadata = {
  title: "EmpatIA Digital · Familias",
  description: "Hogares conectados, familias empáticas.",
};

export default function FamiliasPage() {
  return <Presentation track="familias" />;
}
