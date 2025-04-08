import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VictoryModal } from "@/components/VictoryModal";
import { IntroModal } from "@/components/IntroModal";
import { ConceptModal } from "@/components/ConceptModal";
import { MobileWarning } from "@/components/MobileWarning";
import { GameStateProvider } from "@/game/state/GameState";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superseed Garden - A DeFi Plant Cultivation Game",
  description:
    "Cultivate ethereal plants inspired by Superseed - the revolutionary blockchain that brings self-repaying loans to life through Proof of Repayment.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Superseed Garden",
    description:
      "A mystical garden where blockchain innovation blooms into reality. Cultivate ethereal plants and discover the legendary SuperSeed!",
    images: [{ url: "/android-chrome-512x512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Superseed Garden",
    description:
      "A mystical garden where blockchain innovation blooms into reality. Cultivate ethereal plants and discover the legendary SuperSeed!",
    images: ["/android-chrome-512x512.png"],
    creator: "@0x_ultra",
  },
  themeColor: "#7CC6DE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GameStateProvider>
          {children}
          <VictoryModal />
          <IntroModal />
          <ConceptModal />
          <MobileWarning />
        </GameStateProvider>
      </body>
    </html>
  );
}
