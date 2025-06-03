import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "./client-layout";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FashionLens",
  description: "AI-powered outfit analysis, wardrobe management, and style recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden", inter.className)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
