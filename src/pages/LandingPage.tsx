import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { WhyChooseUsSection } from '../components/landing/WhyChooseUsSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { SecuritySection } from '../components/landing/SecuritySection';
import { StatisticsSection } from '../components/landing/StatisticsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FAQSection } from '../components/landing/FAQSection';
import { CallToActionSection } from '../components/landing/CallToActionSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full space-y-0">
      <HeroSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <SecuritySection />
      <StatisticsSection />
      <TestimonialsSection />
      <FAQSection />
      <CallToActionSection />
    </div>
  );
};
