'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from "next/link";
import { motion, useInView, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { AnimatedNavbar } from "@/components/animated-navbar";
import {
  Sparkles,
  Shirt,
  Lightbulb,
  Users,
  DollarSign,
  ArrowRight,
  CheckCircle,
  UploadCloud,
  Palette,
  HeartHandshake,
  Eye,
  ThumbsUp,
  TrendingUp,
  Zap,
  ShieldCheck,
  Star,
  Award,
  MessageSquare,
  Play,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Floating animation for hero elements
const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// CTA Button Animation with Scale and Shake
const ctaAnimation = {
  scale: [1, 1.08, 1.1, 1.08, 1],
  x: [0, -2, 2, -2, 0],
  boxShadow: [
    "0 0 0 0 rgba(139, 92, 246, 0.7)",
    "0 0 0 5px rgba(139, 92, 246, 0.4)",
    "0 0 0 8px rgba(139, 92, 246, 0.2)",
    "0 0 0 5px rgba(139, 92, 246, 0.4)",
    "0 0 0 0 rgba(139, 92, 246, 0.7)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const heroInView = useInView(heroRef);
  const featuresInView = useInView(featuresRef);
  const stepsInView = useInView(stepsRef);
  const testimonialsInView = useInView(testimonialsRef);
  const pricingInView = useInView(pricingRef);

  const controls = useAnimation();

  // Cursor tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorX = useSpring(0, { stiffness: 200, damping: 20 });
  const cursorY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      cursorX.set(x);
      cursorY.set(y);
    }
  }, [cursorX, cursorY]);

  useEffect(() => {
    if (heroInView) {
      controls.start("visible");
    }
  }, [heroInView, controls]);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Custom CSS for additional animations */}      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes heroGradientFlow {
          0% { 
            background-position: 0% 50%; 
            filter: hue-rotate(0deg) brightness(1);
          }
          25% { 
            background-position: 100% 50%; 
            filter: hue-rotate(90deg) brightness(1.1);
          }
          50% { 
            background-position: 200% 50%; 
            filter: hue-rotate(180deg) brightness(1.2);
          }
          75% { 
            background-position: 100% 50%; 
            filter: hue-rotate(270deg) brightness(1.1);
          }
          100% { 
            background-position: 0% 50%; 
            filter: hue-rotate(360deg) brightness(1);
          }
        }

        @keyframes morphBlob {
          0% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(90deg) scale(1.1);
          }
          50% { 
            border-radius: 80% 20% 60% 40% / 40% 80% 60% 20%;
            transform: rotate(180deg) scale(0.9);
          }
          75% { 
            border-radius: 40% 80% 20% 60% / 70% 40% 50% 80%;
            transform: rotate(270deg) scale(1.05);
          }
          100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        .hero-title {
          background: linear-gradient(-45deg, 
            #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, 
            #feca57, #ff9ff3, #54a0ff, #5f27cd,
            #00d2d3, #ff9f43, #10ac84, #ee5a24
          );
          background-size: 600% 600%;
          animation: heroGradientFlow 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 50px rgba(35, 213, 171, 0.4);
          position: relative;
        }

        .hero-title::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(-45deg, 
            rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1), 
            rgba(69, 183, 209, 0.1), rgba(150, 206, 180, 0.1)
          );
          border-radius: 20px;
          filter: blur(30px);
          z-index: -1;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .subtitle-shimmer {
          background: linear-gradient(90deg, #666, #fff, #666);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .floating-badge {
          animation: float 6s ease-in-out infinite;
        }

        .morphing-blob {
          animation: morphBlob 15s ease-in-out infinite;
          filter: blur(1px);
        }

        .cursor-follower {
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .glow-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .glow-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.8s;
        }

        .glow-card:hover::before {
          left: 100%;
        }

        .glow-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
      `}</style>      {/* Header */}
      <AnimatedNavbar />

      <main className="flex-1">{/* Hero Section */}
        <section ref={heroRef} className="relative w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
          {/* Enhanced Morphing Background Blobs */}
          <div className="absolute inset-0 z-0">
            {/* Main morphing blobs */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 morphing-blob"
              animate={{ 
                scale: [1, 1.3, 0.8, 1.2, 1],
                x: [0, 50, -30, 20, 0],
                y: [0, -30, 40, -20, 0],
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 morphing-blob"
              animate={{ 
                scale: [1.2, 0.9, 1.4, 1, 1.2],
                x: [0, -40, 30, -10, 0],
                y: [0, 30, -40, 20, 0],
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 morphing-blob"
              animate={{ 
                scale: [1, 1.1, 1.3, 0.9, 1],
                x: [0, 25, -50, 35, 0],
                y: [0, -25, 30, -40, 0],
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
            
            {/* Additional floating elements around text */}
            <motion.div 
              className="absolute top-1/6 right-1/6 w-40 h-40 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mix-blend-multiply filter blur-lg opacity-20 morphing-blob"
              animate={{ 
                scale: [0.8, 1.2, 0.9, 1.1, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{ 
                duration: 18, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute bottom-1/6 right-1/3 w-32 h-32 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mix-blend-multiply filter blur-lg opacity-25 morphing-blob"
              animate={{ 
                scale: [1.1, 0.7, 1.3, 0.9, 1.1],
                rotate: [360, 180, 0],
              }}
              transition={{ 
                duration: 22, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Cursor Tracking Elements */}
          <motion.div 
            className="absolute w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-screen filter blur-2xl cursor-follower"
            style={{
              left: useMotionValue(mousePosition.x * 100 + '%'),
              top: useMotionValue(mousePosition.y * 100 + '%'),
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full mix-blend-screen filter blur-xl cursor-follower"
            style={{
              left: useMotionValue((mousePosition.x * 80 + 10) + '%'),
              top: useMotionValue((mousePosition.y * 80 + 10) + '%'),
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [0.8, 1.3, 0.8],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="absolute inset-0 z-0">
            <img 
              src="/hero-background.jpg" 
              alt="Fashion background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
            <motion.div 
            className="container relative z-10 flex flex-col items-center justify-center text-center px-4"
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="floating-badge mb-6">
              <Badge className="px-4 py-2 text-sm font-medium bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                AI-Powered Fashion Intelligence
              </Badge>
            </motion.div>

            {/* Enhanced Title with Floating Elements */}
            <div className="relative mb-6">
              {/* Floating decorative elements around the title */}
              <motion.div 
                className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70"
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 360],
                  x: [0, 10, 0],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -top-4 -right-12 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60"
                animate={{
                  scale: [0.8, 1.3, 0.8],
                  rotate: [360, 0],
                  x: [0, -8, 0],
                  y: [0, 8, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div 
                className="absolute -bottom-6 left-4 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-75"
                animate={{
                  scale: [1.2, 0.8, 1.2],
                  rotate: [0, 180, 360],
                  x: [0, 15, 0],
                  y: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              <motion.div 
                className="absolute top-2 right-8 w-3 h-3 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-80"
                animate={{
                  scale: [0.9, 1.4, 0.9],
                  rotate: [180, 540],
                  x: [0, -12, 0],
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
              />

              <motion.h1 
                variants={fadeInUp}
                className="hero-title text-4xl font-bold md:text-6xl lg:text-7xl max-w-4xl relative z-10"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                Transform Your Style with AI
                
                {/* Floating sparkles around text */}
                <motion.div 
                  className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full opacity-80"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -20, -40]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    repeatDelay: 1
                  }}
                />
                <motion.div 
                  className="absolute bottom-0 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-90"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -15, -30]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                    repeatDelay: 1
                  }}
                />
                <motion.div 
                  className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-75"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -25, -50]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1,
                    repeatDelay: 1
                  }}
                />
              </motion.h1>
            </div>
            
            <motion.p 
              variants={fadeInUp}
              className="subtitle-shimmer mb-8 text-lg md:text-xl max-w-2xl leading-relaxed"
            >
              Discover your unique fashion identity with AI-driven outfit analysis, personalized wardrobe management, and expert style recommendations.
            </motion.p>
              <motion.div 
              variants={fadeInUp}
              className="flex justify-center mb-8"
            >
              <motion.div
                animate={ctaAnimation}
                whileHover={{ 
                  scale: 1.12,
                  animationPlayState: "paused"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl relative overflow-hidden" asChild>
                  <Link href="/register">
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" 
                      animate={{ translateX: "200%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    Start Your Style Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-6 text-sm text-white/80"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>AI-powered insights</span>
              </div>
            </motion.div>
          </motion.div>
        </section>        {/* Features Section */}
        <section ref={featuresRef} className="py-24 bg-gradient-to-b from-background to-muted/20">
          <motion.div 
            className="container px-4"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Revolutionize Your Wardrobe
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience the future of fashion with our cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">              <motion.div variants={scaleIn}>
                <Card className="glow-card h-full border shadow-xl bg-card/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <UploadCloud className="h-8 w-8" />
                    </motion.div>                    <CardTitle className="text-2xl md:text-3xl font-semibold">Smart Upload & Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Upload photos of your outfits and get instant AI-powered style analysis with personalized recommendations.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Card className="glow-card h-full border shadow-xl bg-card/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Palette className="h-8 w-8" />
                    </motion.div>                    <CardTitle className="text-2xl md:text-3xl font-semibold">Wardrobe Management</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Organize your entire wardrobe digitally. Track what you own, what you wear, and discover new combinations.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Card className="glow-card h-full border shadow-xl bg-card/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Lightbulb className="h-8 w-8" />
                    </motion.div>                    <CardTitle className="text-2xl md:text-3xl font-semibold">Style Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Get personalized outfit suggestions based on weather, occasion, and your unique style preferences.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>        {/* How It Works Section */}
        <section ref={stepsRef} className="py-24 bg-background">
          <motion.div 
            className="container px-4"
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">How It Works</h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Get started in three simple steps
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div variants={slideInLeft} className="text-center">
                <motion.div 
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl font-bold"
                  whileHover={{ scale: 1.1 }}
                  animate={floatingAnimation}
                >
                  1
                </motion.div>                <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Upload Your Photos</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Take photos of your outfits or individual clothing items and upload them to your digital wardrobe.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="text-center">
                <motion.div 
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl font-bold"
                  whileHover={{ scale: 1.1 }}
                  animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
                >
                  2
                </motion.div>                <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Get AI Analysis</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Our advanced AI analyzes your style, colors, fit, and suggests improvements and new combinations.
                </p>
              </motion.div>

              <motion.div variants={slideInRight} className="text-center">
                <motion.div 
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-2xl font-bold"
                  whileHover={{ scale: 1.1 }}
                  animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
                >
                  3
                </motion.div>                <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Transform Your Style</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Discover new outfit possibilities, build confidence, and express your unique fashion personality.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-24 bg-muted/30">
          <motion.div 
            className="container px-4"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">What Our Users Say</h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied users who have transformed their style
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "FashionLens has completely transformed how I approach my wardrobe. The AI recommendations are spot-on!",
                  author: "Sarah Chen",
                  role: "Fashion Blogger",
                  avatar: "SC"
                },
                {
                  quote: "I save so much time getting ready now. The outfit suggestions are perfect for every occasion.",
                  author: "Michael Rodriguez",
                  role: "Marketing Director",
                  avatar: "MR"
                },
                {
                  quote: "The sustainability insights helped me make better fashion choices. Love this app!",
                  author: "Emma Thompson",
                  role: "Environmental Activist",
                  avatar: "ET"
                }
              ].map((testimonial, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + i * 0.1 }}
                          >
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm mr-4">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>        {/* Pricing Section */}
        <section ref={pricingRef} className="py-24 bg-background">
          <motion.div 
            className="container px-4"
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">Choose Your Plan</h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Start free and upgrade as you grow
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <motion.div variants={slideInLeft}>
                <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300">                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-semibold">Starter</CardTitle>
                    <div className="text-4xl md:text-5xl font-bold">Free</div>
                    <p className="text-lg md:text-xl text-muted-foreground">Perfect for trying out</p>
                  </CardHeader>
                  <CardContent>                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">5 outfit analyses per month</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Basic style recommendations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Digital wardrobe (up to 50 items)</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6 text-base md:text-lg py-3" variant="outline" asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>              <motion.div variants={scaleIn}>
                <Card className="relative border-2 border-purple-500 shadow-xl scale-105">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-semibold">Pro</CardTitle>
                    <div className="text-4xl md:text-5xl font-bold">
                      <span className="line-through text-2xl md:text-3xl text-muted-foreground mr-2">
                        $9.99
                      </span>
                      <div className="text-sm text-green-600 font-normal mb-2">Currently Free!</div>
                      Free
                      <span className="text-xl md:text-2xl font-normal">/month</span>
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground">For fashion enthusiasts</p>
                  </CardHeader>
                  <CardContent>                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Unlimited outfit analyses</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Advanced AI recommendations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Unlimited wardrobe items</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Style trend insights</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Priority support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6 text-base md:text-lg py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                      <Link href="/register">Start Free Trial</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={slideInRight}>
                <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300">                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-semibold">Enterprise</CardTitle>
                    <div className="text-4xl md:text-5xl font-bold">Custom</div>
                    <p className="text-lg md:text-xl text-muted-foreground">For businesses</p>
                  </CardHeader>
                  <CardContent>                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Everything in Pro</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Team collaboration</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Custom integrations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-base md:text-lg">Dedicated support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6 text-base md:text-lg py-3" variant="outline" asChild>
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white">          <motion.div 
            className="container px-4 text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ready to Transform Your Style?
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of users who have revolutionized their wardrobe with AI-powered fashion intelligence.
            </motion.p>
            <motion.div
              animate={ctaAnimation}
              whileHover={{ 
                scale: 1.12,
                animationPlayState: "paused"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="px-12 py-6 text-xl md:text-2xl font-semibold bg-white text-purple-600 hover:bg-gray-50 shadow-xl" asChild>
                <Link href="/register">
                  Get Started Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12 px-4">
          <div className="grid gap-8 md:grid-cols-4">            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">FashionLens</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                Transform your style with AI-powered fashion intelligence.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </div>            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-base md:text-lg">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-base md:text-lg">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-base md:text-lg">
                <li><Link href="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />          <div className="flex flex-col md:flex-row justify-between items-center text-base md:text-lg text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FashionLens. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <HeartHandshake className="h-4 w-4 text-red-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
