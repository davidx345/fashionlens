'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedNavbar } from '@/components/animated-navbar';
import { 
  Sparkles, 
  Users, 
  Target, 
  Heart, 
  ArrowRight,
  Mail,
  Phone,
  Quote
} from 'lucide-react';

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 });
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Add staggered animation delays for children
            const children = entry.target.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-in');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: 'Ayodele David',
      title: 'Lead AI Engineer & Backend Engineer',
      image: '/placeholder.svg',
      description: 'Architect of our cutting-edge AI fashion analysis algorithms and backend infrastructure.',
      initials: 'AD',
    },
    {
      name: 'Adelodun Abraham',
      title: 'Lead Backend Engineer',
      image: '/placeholder.svg',
      description: 'Masters the server-side architecture and database systems that power FashionLens.',
      initials: 'AA',
    },
    {
      name: 'Okeke Onyedikachukwu',
      title: 'Lead Frontend Developer',
      image: '/placeholder.svg',
      description: 'Crafts intuitive and beautiful user experiences with modern React technologies.',
      initials: 'OO',
    },
  ];

  const testimonials = [
    {
      quote:
        "FashionLens has completely transformed how I manage my wardrobe. I'm more confident in my style than ever!",
      author: 'Sarah L.',
    },
    {
      quote:
        'The outfit recommendations are spot on! It saves me so much time getting ready.',
      author: 'David K.',
    },
    {
      quote:
        'I love how FashionLens helps me make sustainable fashion choices. A truly innovative platform.',
      author: 'Jessica M.',
    },  ];  return (    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <AnimatedNavbar />{/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        @keyframes morphGlow {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            filter: hue-rotate(0deg);
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            filter: hue-rotate(180deg);
          }
        }

        .hero-title {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradientShift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(35, 213, 171, 0.3);
          font-size: clamp(2.5rem, 8vw, 4rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .subtitle-shimmer {
          background: linear-gradient(90deg, #666, #fff, #666);
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: clamp(1.125rem, 3vw, 1.5rem);
          line-height: 1.6;
        }

        .hero-image-container {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-image-3d {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
        }

        .hero-image-3d::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            transparent 70%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .hero-image-3d:hover::before {
          opacity: 1;
        }

        .hero-image-3d:hover {
          transform: 
            rotateX(calc((var(--mouse-y, 50) - 50) * 0.1deg))
            rotateY(calc((var(--mouse-x, 50) - 50) * 0.1deg))
            translateZ(20px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .typewriter {
          overflow: hidden;
          border-right: 0.15em solid #23d5ab;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: 0.05em;
          animation: typewriter 3s steps(40, end), blink-caret 0.75s step-end infinite;
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: #23d5ab;
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-child {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .stagger-child.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .floating {
          animation: floating 4s ease-in-out infinite;
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }

        .pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          from {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          to {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3);
          }
        }

        .glow-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .team-card {
          transform: perspective(1000px) rotateX(0) rotateY(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
        }

        .team-card:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .team-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s;
          opacity: 0;
        }

        .team-card:hover::after {
          opacity: 1;
          transform: rotate(45deg) translate(50%, 50%);
        }

        .section-title {
          position: relative;
          display: inline-block;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          width: 0;
          height: 4px;
          background: linear-gradient(90deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .section-title.animate-in::after {
          width: 100%;
        }

        .testimonial-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
        }

        .testimonial-card:hover {
          transform: translateY(-5px) scale(1.03);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .fade-in-left {
          animation: fadeInLeft 1s ease forwards;
        }

        .fade-in-right {
          animation: fadeInRight 1s ease forwards;
        }

        .scale-in {
          animation: scaleIn 0.8s ease forwards;
        }

        .slide-down {
          animation: slideDown 0.8s ease forwards;
        }

        .morphing-blob {
          animation: morphGlow 8s ease-in-out infinite;
        }

        .modern-text {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.7;
          letter-spacing: 0.01em;
        }

        .enhanced-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .enhanced-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .enhanced-button:hover::before {
          left: 100%;
        }

        .enhanced-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
      `}</style>
        {/* Hero Section with Image Split Layout */}
      <section ref={heroRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <h1 className="hero-title font-bold leading-tight">
                  About FashionLens
                </h1>
                <p className="subtitle-shimmer modern-text max-w-xl">
                  Empowering your style with AI-driven insights and revolutionary fashion technology. 
                  Experience the future of personalized wardrobe management.
                </p>
              </div>
                {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" asChild className="enhanced-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Link href="/register">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="enhanced-button text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Link href="/dashboard">Explore Features</Link>
                </Button>
              </div>
              
              {/* Floating icon */}
              <div className="floating">
                <div className="inline-block p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow morphing-blob">
                  <Sparkles className="w-10 h-10" />
                </div>
              </div>
            </div>
            
            {/* Right side - Image with 3D Effect */}
            <div className="relative lg:order-last order-first">
              <div 
                ref={imageRef}
                className="hero-image-container relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className="hero-image-3d relative overflow-hidden rounded-3xl shadow-2xl"
                  style={{
                    '--mouse-x': `${mousePosition.x}%`,
                    '--mouse-y': `${mousePosition.y}%`,
                  } as React.CSSProperties}
                >
                  <Image
                    src="/about-img.jpg"
                    alt="Fashion and Style"
                    width={700}
                    height={800}
                    className="object-cover w-full h-[450px] md:h-[550px] lg:h-[700px]"
                    priority
                  />
                  {/* Enhanced overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
                
                {/* Enhanced decorative elements */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-60 floating morphing-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-2xl opacity-50 floating morphing-blob" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 -right-4 w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-xl opacity-40 floating" style={{animationDelay: '4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Our Story Section */}
      <section className="mb-16 animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center section-title">Our Story</h2>
          <div className="grid gap-12 md:grid-cols-2">
            <Card className="glow-card stagger-child p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="modern-text text-muted-foreground leading-relaxed">
                  At FashionLens, our mission is to empower individuals to express their unique
                  style with confidence and creativity. We believe that fashion should be
                  accessible, sustainable, and personal. Through innovative AI-powered tools,
                  we help you discover new outfit possibilities, manage your wardrobe
                  efficiently, and make informed fashion choices that align with your values.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-600 border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Empowering style worldwide</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glow-card stagger-child p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="modern-text text-muted-foreground leading-relaxed">
                  We envision a world where everyone feels confident in their clothing choices,
                  where personal style is celebrated, and where fashion consumption is mindful
                  and sustainable. We aim to be the leading platform for personalized fashion
                  intelligence, fostering a community that embraces self-expression and
                  responsible fashion practices.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Building the future of fashion</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-12" />      {/* Why Choose Us Section */}
      <section className="mb-16 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 section-title">Why Choose FashionLens?</h2>
          <p className="mb-12 modern-text text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make FashionLens the ultimate fashion companion for your style journey.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="glow-card stagger-child group overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center gap-4 text-xl">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    Personalized Style
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="modern-text text-muted-foreground leading-relaxed">
                  Get recommendations tailored to your unique preferences, body type, and wardrobe with advanced AI algorithms.
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 px-3 py-1">
                    AI-Powered
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glow-card stagger-child group overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center gap-4 text-xl">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                    Smart Organization
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="modern-text text-muted-foreground leading-relaxed">
                  Organize, track, and optimize your clothing collection with intelligent categorization and usage analytics.
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
                    Smart Tech
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glow-card stagger-child group overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center gap-4 text-xl">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                    Sustainable Fashion
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="modern-text text-muted-foreground leading-relaxed">
                  Make eco-conscious choices with insights into your fashion footprint and sustainable recommendations.
                </p>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 px-3 py-1">
                    Eco-Friendly
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-12" />      {/* Meet Our Team Section */}
      <section className="mb-16 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 section-title">Meet Our Team</h2>
          <p className="mb-12 modern-text text-muted-foreground max-w-2xl mx-auto">
            The passionate innovators behind FashionLens, dedicated to revolutionizing your fashion experience.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center team-card stagger-child relative overflow-hidden">
                <CardContent className="pt-8 pb-6">
                  <div className="relative mb-6 inline-block">
                    <Avatar className="mx-auto h-28 w-28 ring-4 ring-gradient-to-r from-blue-500 to-purple-600 ring-offset-4 ring-offset-background">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {member.name}
                  </h3>
                  
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-1 text-sm font-medium">
                      {member.title}
                    </Badge>
                  </div>
                  
                  <p className="modern-text text-muted-foreground leading-relaxed mb-6 px-2">
                    {member.description}
                  </p>
                  
                  <div className="flex justify-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  
                  {/* Social links placeholder */}
                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-12" />      {/* Testimonials Section */}
      <section className="mb-16 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 section-title">What Our Users Say</h2>
          <p className="mb-12 modern-text text-muted-foreground max-w-2xl mx-auto">
            Real experiences from fashion enthusiasts who have transformed their style with FashionLens.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card stagger-child relative overflow-hidden group">
                <CardContent className="pt-8 pb-6">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Quote className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  {/* Star rating */}
                  <div className="flex items-center justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  
                  {/* Quote text */}
                  <p className="mb-6 modern-text text-muted-foreground leading-relaxed italic relative">
                    <span className="text-4xl text-blue-200 absolute -top-2 -left-2">"</span>
                    {testimonial.quote}
                    <span className="text-4xl text-blue-200 absolute -bottom-4 -right-2">"</span>
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-blue-600">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">Verified User</p>
                    </div>
                  </div>
                  
                  {/* Success indicator */}
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium">Verified Review</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-12" />      {/* Contact Us Section */}
      <section className="text-center animate-on-scroll px-4 sm:px-6 lg:px-8 mb-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-4 section-title">Get in Touch</h2>
          <p className="mb-12 modern-text text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you! Reach out with any questions, feedback, or inquiries about FashionLens.
          </p>
          
          {/* Contact options */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="glow-card stagger-child p-8 text-left">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Email Us
                  </h3>
                  <p className="modern-text text-muted-foreground mb-4">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:info@fashionlens.com"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <span>info@fashionlens.com</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
            
            <Card className="glow-card stagger-child p-8 text-left">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Call Us
                  </h3>
                  <p className="modern-text text-muted-foreground mb-4">
                    Speak directly with our support team for immediate assistance.
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <span>+1 (234) 567-890</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        
          {/* Call to Action */}
          <div className="stagger-child">
            <div className="relative inline-block p-12 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-500 rounded-full morphing-blob"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-500 rounded-full morphing-blob" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-pink-500 rounded-full morphing-blob" style={{animationDelay: '4s'}}></div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Sparkles className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ready to Transform Your Style?
                </h3>
                
                <p className="modern-text text-muted-foreground mb-8 max-w-md mx-auto">
                  Join thousands of users who have revolutionized their wardrobe with FashionLens AI.
                  Start your style journey today.
                </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button className="enhanced-button px-4 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link href="/register" className="flex items-center gap-2">
                      Get Started Today
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="enhanced-button px-4 sm:px-8 py-3 rounded-full font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link href="/dashboard">
                      Explore Features
                    </Link>
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-8 flex justify-center items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Setup in 2 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
