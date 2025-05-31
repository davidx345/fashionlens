"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/store/useStore"; // Import Zustand store

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Use Zustand store

  const isDarkMode = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{
            scale: 1.1,
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              {!isDarkMode && (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
              )}
              {isDarkMode && (
                <motion.div
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: 90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
