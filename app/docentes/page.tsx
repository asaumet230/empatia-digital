import type { Metadata } from "next";
import { Presentation } from "@/components/presentation/Presentation";

export const metadata: Metadata = {
  title: "EmpatIA Digital · Docentes",
  description: "Mediación tecnológica y diagnóstico del aula con IA.",
};

export default function DocentesPage() {
  return <Presentation track="docentes" />;
}
