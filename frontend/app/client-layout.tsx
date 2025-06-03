"use client";

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "@/app/hooks/useSession";
import { useEffect } from "react";

function SessionManager({ children }: { children: React.ReactNode }) {
  const { isLoading } = useSession();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SessionManager>
          {children}
        </SessionManager>
      </ThemeProvider>
    </SessionProvider>
  );
}
