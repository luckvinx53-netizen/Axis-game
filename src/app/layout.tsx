import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontDisplay = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const fontBody = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Axis Game",
  description: "Axis Game — carreira de jogador e treinador, motor de simulação e clube completo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
