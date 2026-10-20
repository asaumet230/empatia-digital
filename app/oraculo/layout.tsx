import type { Metadata, Viewport } from "next";
import { THEME_SCRIPT } from "@/lib/oraculo/tema";

export const metadata: Metadata = {
  title: "Oráculo · EmpatIA Digital",
  description: "Escucha y orientación sobre convivencia escolar, acoso y ciberacoso.",
};

// Light by default like any chat; dark when the device is in dark mode
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1f2c" },
  ],
};

export default function OraculoLayout({ children }: LayoutProps<"/oraculo">) {
  return (
    <div className="oraculo-theme min-h-dvh bg-o-bg text-o-text">
      {/* Applies a saved light/dark choice before the first paint */}
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {children}
    </div>
  );
}
