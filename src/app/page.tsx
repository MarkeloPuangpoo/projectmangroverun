'use client';

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RaceInfoSection from "@/components/RaceInfoSection";
import HighlightsSection from "@/components/HighlightsSection";
import RouteMapSection from "@/components/RouteMapSection";
import AwardsRulesSection from "@/components/AwardsRulesSection";
import Footer from "@/components/Footer";
import ObjectiveSection from "@/components/ObjectiveSection";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-white selection:bg-neon-green selection:text-deep-blue">
        <Header />
        <HeroSection />
        <ObjectiveSection />
        <RaceInfoSection />
        <HighlightsSection />
        <RouteMapSection />
        <AwardsRulesSection />
        <FAQSection />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
