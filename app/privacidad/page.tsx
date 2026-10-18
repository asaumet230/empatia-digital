import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";
import { PRIVACY_META, PRIVACY_POLICY, PRIVACY_SUMMARY } from "@/lib/content/privacidad";

export const metadata: Metadata = {
  title: "Política de privacidad · EmpatIA Digital",
  description: "Política de privacidad y tratamiento de datos personales de EmpatIA Digital.",
};

export default function PrivacidadPage() {
  return <PolicyPage {...PRIVACY_META} summary={PRIVACY_SUMMARY} sections={PRIVACY_POLICY} />;
}
