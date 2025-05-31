"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back
    </Button>
  );
}
