import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-lg font-bold">
              Dashboard
            </Link>
            <Link href="/dashboard/analyzer" className="text-sm font-medium text-muted-foreground">
              Analyzer
            </Link>
            <Link href="/dashboard/recommendations" className="text-sm font-medium text-muted-foreground">
              Recommendations
            </Link>
            <Link href="/dashboard/wardrobe" className="text-sm font-medium text-muted-foreground">
              Wardrobe
            </Link>
            <Link href="/dashboard/settings" className="text-sm font-medium text-muted-foreground">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
