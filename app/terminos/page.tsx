import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";
import { TERMS, TERMS_META, TERMS_SUMMARY } from "@/lib/content/terminos";

export const metadata: Metadata = {
  title: "Términos y condiciones · EmpatIA Digital",
  description: "Términos y condiciones de uso de EmpatIA Digital.",
};

export default function TerminosPage() {
  return <PolicyPage {...TERMS_META} summary={TERMS_SUMMARY} sections={TERMS} />;
}
