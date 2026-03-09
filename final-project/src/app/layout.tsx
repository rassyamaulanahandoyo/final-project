import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { PlayerProvider } from "../context/PlayerContext";
import GlobalSpotifyPlayer from "../components/GlobalSpotifyPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe - Gesture Controlled Music",
  description: "Experience music like never before with hand gesture controls",
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
        <AuthProvider>
          <PlayerProvider>
            {children}
            <GlobalSpotifyPlayer />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
