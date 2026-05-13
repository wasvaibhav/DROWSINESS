import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driver Alert AI — Real-Time Drowsiness Detection",
  description:
    "AI-powered driver drowsiness and yawning detection using your webcam. Runs entirely in your browser for maximum privacy and zero latency.",
  keywords: [
    "drowsiness detection",
    "driver alert",
    "AI",
    "face detection",
    "yawn detection",
    "road safety",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
