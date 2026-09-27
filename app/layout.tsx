import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Unbounded } from "next/font/google";
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
      data-intro="booting"
      className={`${unbounded.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
