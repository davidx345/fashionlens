// filepath: c:\\Users\\xstat\\OneDrive\\Documents\\Dev\\webDev\\fashionlens\\frontend\\app\\temp-server-layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "./client-layout"; // This will be the new name for the client part
import { cn } from "@/lib/utils"; // Import cn

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FashionLens",
  description: "AI-powered outfit analysis, wardrobe management, and style recommendations.",
};

export default function RootServerLayout({ // Will be renamed to RootLayout
  children,
}: {
  children: React.ReactNode;
}) {
  return (    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden", inter.className)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
