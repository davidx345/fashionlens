"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, LogOut, Menu, Package2, Settings, Shirt, ShoppingBag, Users, Lightbulb, BarChart3, FolderKanban, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle"; // Import ThemeToggle
import { logoutUser } from "@/app/api/services/auth-service"; // Import logoutUser

// Re-using MobileNav structure but adapting for dashboard links
import { MobileNav } from "@/components/mobile-nav"; // We might need to adapt this or create a new one

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/outfit-analyzer", label: "Outfit Analyzer", icon: Shirt },
  { href: "/dashboard/wardrobe", label: "Wardrobe", icon: FolderKanban },
  { href: "/dashboard/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, setUser, setAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Fixed Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 h-screen w-[220px] lg:w-[280px] border-r bg-muted/40 z-40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold transition-transform hover:scale-105 duration-200">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">FashionLens</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10 hover:scale-105 duration-200",
                  pathname === item.href && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start transition-transform hover:scale-105 duration-200" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex flex-col md:ml-[220px] lg:ml-[280px] pt-16 md:pt-0">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden transition-transform hover:scale-105 duration-200"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4 transition-transform hover:scale-105 duration-200"
                >
                  <Package2 className="h-6 w-6 text-primary" />
                  {user ? (
                    <span className="ml-2 font-normal text-muted-foreground">{user.name}</span>
                  ) : (
                    <span className="sr-only">FashionLens</span>
                  )}
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all hover:scale-105 duration-200",
                      pathname === item.href && "bg-muted text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-4 border-t">
                <div className="mb-2">
                  <ThemeToggle />
                </div>
                <Button variant="ghost" className="w-full justify-start transition-transform hover:scale-105 duration-200" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-3">
            {user && (
              <>
                <span className="text-sm text-muted-foreground font-medium hidden sm:block">{user.name}</span>
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full transition-transform hover:scale-110 duration-200 cursor-pointer">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
