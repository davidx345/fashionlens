"use client"

import * as React from "react"
import { useState } from "react" // Import useState
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle" // Corrected import name

export function MainNav() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null); // State to control active menu item

  return (
    <div className="hidden flex-col gap-6 md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <span className="sr-only">FashionLens</span>
        <span className="text-primary">FashionLens</span>
      </Link>
      <NavigationMenu value={activeFeature || ""} onValueChange={setActiveFeature}>
        <NavigationMenuList>
          <NavigationMenuItem value="features"> {/* Add value prop */}
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        FashionLens
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        AI-powered outfit analysis, wardrobe management, and style recommendations.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/dashboard/analyze" title="Outfit Analyzer">
                  Get real-time AI analysis of your outfits.
                </ListItem>
                <ListItem href="/dashboard/wardrobe" title="Wardrobe Manager">
                  Organize your clothing items and create new looks.
                </ListItem>
                <ListItem href="/dashboard/recommendations" title="Style Recommendations">
                  Receive personalized style tips and outfit suggestions.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/pricing" className={navigationMenuTriggerStyle()}>
              Pricing
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" className={navigationMenuTriggerStyle()}>
              About Us
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4 ml-auto">
        {/* <Button variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button>
          <Link href="/register">Sign Up</Link>
        </Button> */}
        <ThemeToggle /> {/* Corrected component name */}
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
