import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Unbounded } from "next/font/google";
import { OracleLauncher } from "@/components/oraculo/OracleLauncher";
import { SITE_URL } from "@/lib/constants";
import { ORACLE_ENABLED } from "@/lib/oraculo/activo";
import { THEME_SCRIPT } from "@/lib/oraculo/tema";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "500", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "EmpatIA Digital",
  description: "Tecnología que conecta personas. Capacitación interactiva EmpatIA Digital.",
};

export const viewport: Viewport = {
  themeColor: "#0F1F2C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* The Oráculo's saved light/dark choice, applied before the first paint. It lives here because
            this layout is rendered once on the server: a script in a nested layout would not run when
            the Oráculo is reached by navigating inside the site. Other pages ignore the attribute. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-svh">
        {children}
        {ORACLE_ENABLED && <OracleLauncher />}
      </body>
    </html>
  );
}
