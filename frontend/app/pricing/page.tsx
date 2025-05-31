"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'outline' | 'default' | 'link' | 'destructive' | 'secondary' | 'ghost';
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
      <Card className="flex h-full flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{plan.name}</CardTitle>
          <div className="mt-4 text-center text-4xl font-bold">{plan.price}</div>
        </CardHeader>
        <CardContent>
          <ul className="mb-8 space-y-2">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-5 w-5 text-green-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Button className="w-full" variant={plan.buttonVariant}>
            {plan.buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function PricingPage() {
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: '$9/month',
      features: [
        '50 Wardrobe Items',
        '10 Outfit Analyses/month',
        'Basic Recommendations',
        'Email Support',
      ],
      buttonText: 'Choose Basic',
      buttonVariant: 'outline',
    },
    {
      name: 'Pro',
      price: '$29/month',
      features: [
        'Unlimited Wardrobe Items',
        'Unlimited Outfit Analyses',
        'Advanced Recommendations',
        'Priority Email Support',
        'Style Insights',
      ],
      buttonText: 'Choose Pro',
      buttonVariant: 'default',
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      features: [
        'Custom Solutions',
        'Dedicated Account Manager',
        'API Access',
        '24/7 Phone Support',
        'On-site Training',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
      <h1 className="mb-4 text-center text-4xl font-bold">Pricing Plans</h1>
      <p className="mb-12 text-center text-xl text-muted-foreground">
        Choose the perfect plan for your fashion journey.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <PlanCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Have more questions? <a href="#" className="text-blue-500 hover:underline">Contact us</a>.
        </p>
      </div>
    </div>
  );
}
