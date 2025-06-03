"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import { AnimatedNavbar } from '@/components/animated-navbar';

interface PricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'outline' | 'default' | 'link' | 'destructive' | 'secondary' | 'ghost';
  isPopular?: boolean;
  isFree?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Stagger the animation
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 30, // Optional: slight slide down on exit
    transition: {
      delay: i * 0.1, // Stagger exit slightly if desired, or remove for simultaneous exit
      duration: 0.3,
      ease: "easeIn"
    }
  })
};

const PlanCard: React.FC<{ plan: PricingPlan; index: number }> = ({ plan, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Animate every time it comes into view
    threshold: 0.1, // Trigger when 10% of the card is visible
  });

  return (
    <motion.div
      ref={ref}
      custom={index} // Pass index for staggered delay
      initial="hidden"
      animate={inView ? "visible" : "exit"}
      variants={cardVariants}
    >
      <Card className={`relative border-2 h-full transition-colors duration-300 ${
        plan.isPopular 
          ? 'border-purple-500 shadow-xl scale-105' 
          : 'border-gray-200 hover:border-purple-300'
      }`}>
        {plan.isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
              Most Popular
            </Badge>
          </div>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-semibold">{plan.name}</CardTitle>
          <div className="text-4xl md:text-5xl font-bold">
            {plan.originalPrice && (
              <>
                <span className="line-through text-2xl md:text-3xl text-muted-foreground mr-2">
                  {plan.originalPrice}
                </span>
                <div className="text-sm text-green-600 font-normal mb-2">Currently Free!</div>
              </>
            )}
            {plan.price}
            {plan.price.includes('$') && (
              <span className="text-xl md:text-2xl font-normal">/month</span>
            )}
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">{plan.description}</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-base md:text-lg">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full mt-6 text-base md:text-lg py-3 ${
              plan.isPopular 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                : ''
            }`} 
            variant={plan.buttonVariant}
            asChild
          >
            <Link href="/register">{plan.buttonText}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function PricingPage() {
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out',
      features: [
        '5 outfit analyses per month',
        'Basic style recommendations',
        'Digital wardrobe (up to 50 items)',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      isFree: true,
    },
    {
      name: 'Pro',
      price: 'Free',
      originalPrice: '$9.99',
      description: 'For fashion enthusiasts',
      features: [
        'Unlimited outfit analyses',
        'Advanced AI recommendations',
        'Unlimited wardrobe items',
        'Style trend insights',
        'Priority support',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For businesses',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        '24/7 priority support',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
    },
  ];return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnimatedNavbar />      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <h1 className="mb-4 text-center text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">Choose Your Plan</h1>
        <p className="mb-12 text-center text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Start free and upgrade as you grow
        </p>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Have more questions? <a href="#" className="text-blue-500 hover:underline">Contact us</a>.
        </p>        </div>
      </main>
    </div>
  );
}
