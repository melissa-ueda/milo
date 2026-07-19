import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/src/presentation/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "Milo · Household intelligence",
  description: "Your household consumption companion",
  manifest: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/manifest.json`
    : "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Milo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
