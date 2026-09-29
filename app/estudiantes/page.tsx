import type { Metadata } from "next";
import { Presentation } from "@/components/presentation/Presentation";

export const metadata: Metadata = {
  title: "EmpatIA Digital · Estudiantes",
  description: "Ciudadanía digital y creadores de paz con IA.",
};

export default function EstudiantesPage() {
  return <Presentation track="estudiantes" />;
}
