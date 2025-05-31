'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
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
    },  ];  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="hidden space-x-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </nav>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

        .hero-title {
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(35, 213, 171, 0.3);
        }

        .subtitle-shimmer {
          background: linear-gradient(90deg, #666, #fff, #666);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-child {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .stagger-child.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .floating {
          animation: floating 3s ease-in-out infinite;
        }

        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          from {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          to {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3);
          }
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

        .team-card {
          transform: perspective(1000px) rotateX(0) rotateY(0);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .team-card:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
          transition: all 0.5s;
          opacity: 0;
        }

        .team-card:hover::after {
          opacity: 1;
          transform: rotate(45deg) translate(50%, 50%);
        }

        .section-title {
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          transition: all 0.8s ease;
          transform: translateX(-50%);
        }

        .section-title.animate-in::after {
          width: 100%;
        }

        .testimonial-card {
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .testimonial-card:hover {
          transform: scale(1.02);
          border-color: rgba(59, 130, 246, 0.2);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .fade-in-left {
          animation: fadeInLeft 0.8s ease forwards;
        }

        .fade-in-right {
          animation: fadeInRight 0.8s ease forwards;
        }

        .scale-in {
          animation: scaleIn 0.6s ease forwards;
        }

        .slide-down {
          animation: slideDown 0.6s ease forwards;
        }      `}</style>
      
      {/* Hero Section with Image Split Layout */}
      <section ref={heroRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="hero-title text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
                  About FashionLens
                </h1>
                <p className="subtitle-shimmer text-lg text-muted-foreground md:text-xl max-w-lg">
                  Empowering your style with AI-driven insights and revolutionary fashion technology.
                </p>
              </div>
              
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href="/register">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">Explore Features</Link>
                </Button>
              </div>
              
              {/* Floating icon */}
              <div className="floating">
                <div className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white pulse-glow">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="relative lg:order-last order-first">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/about-img.jpg"
                  alt="Fashion and Style"
                  width={600}
                  height={700}
                  className="object-cover w-full h-[400px] md:h-[500px] lg:h-[600px]"
                  priority
                />
                {/* Overlay gradient for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-70 floating"></div>              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-xl opacity-60 floating" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-12 animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-3xl font-bold section-title">Our Story</h2>
          <div className="grid gap-8 md:grid-cols-2">
          <Card className="glow-card stagger-child">
            <CardHeader>
              <CardTitle className="text-gradient">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                At FashionLens, our mission is to empower individuals to express their unique
                style with confidence and creativity. We believe that fashion should be
                accessible, sustainable, and personal. Through innovative AI-powered tools,
                we help you discover new outfit possibilities, manage your wardrobe
                efficiently, and make informed fashion choices that align with your values.
              </p>
            </CardContent>
          </Card>

          <Card className="glow-card stagger-child">
            <CardHeader>
              <CardTitle className="text-gradient">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We envision a world where everyone feels confident in their clothing choices,
                where personal style is celebrated, and where fashion consumption is mindful
                and sustainable. We aim to be the leading platform for personalized fashion
                intelligence, fostering a community that embraces self-expression and
                responsible fashion practices.
              </p>
            </CardContent>
          </Card>        </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Why Choose Us Section */}
      <section className="mb-12 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold section-title">Why Choose FashionLens?</h2>
          <div className="grid gap-8 md:grid-cols-3">
          <Card className="glow-card stagger-child">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                Personalized Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get recommendations tailored to your unique preferences and wardrobe.
              </p>
            </CardContent>
          </Card>
          <Card className="glow-card stagger-child">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                Smart Wardrobe Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize, track, and optimize your clothing collection effortlessly.
              </p>
            </CardContent>
          </Card>
          <Card className="glow-card stagger-child">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                Sustainable Fashion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Make eco-conscious choices with insights into your fashion impact.
              </p>
            </CardContent>          </Card>
        </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Meet Our Team Section */}
      <section className="mb-12 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold section-title">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center team-card stagger-child">
              <CardContent className="pt-6">
                <div className="relative mb-4">
                  <Avatar className="mx-auto h-24 w-24 ring-4 ring-gradient-to-r from-blue-500 to-purple-600 ring-offset-2">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </CardContent>
            </Card>          ))}
        </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Testimonials Section */}
      <section className="mb-12 text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold section-title">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card stagger-child relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-blue-500 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                <p className="mb-4 italic text-muted-foreground leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="font-semibold text-blue-600">- {testimonial.author}</p>
              </CardContent>
            </Card>          ))}
        </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Contact Us Section */}
      <section className="text-center animate-on-scroll px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-bold section-title">Get in Touch</h2>
        <p className="mb-6 text-muted-foreground subtitle-shimmer">
          We'd love to hear from you! Reach out with any questions or inquiries.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="mailto:info@fashionlens.com"
            className="flex items-center text-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 stagger-child group"
          >
            <div className="mr-2 p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <span className="font-medium">info@fashionlens.com</span>
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center text-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 stagger-child group"
          >
            <div className="mr-2 p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="font-medium">+1 (234) 567-890</span>
          </a>
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 stagger-child">
          <div className="inline-block p-8 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Transform Your Style?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of users who have revolutionized their wardrobe with FashionLens AI.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Today            </button>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
