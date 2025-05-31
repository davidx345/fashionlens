"use client";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, ReactNode } from "react";
import { Card } from "@/components/ui/card"; // Assuming CardProps is exported or create a similar interface

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
  once?: boolean; // To trigger animation only once
}

export function AnimatedCard({
  children,
  direction = "up",
  delay = 0,
  className,
  once = false, // Changed default from true to false
  ...props
}: AnimatedCardProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      // This will now be the common case if 'once' is not explicitly set to true
      controls.start("hidden");
    }
  }, [controls, inView, once]);

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.6, 0.05, 0.01, 0.9], // Corrected to array format with valid values
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={className} // Pass className to the motion.div
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
