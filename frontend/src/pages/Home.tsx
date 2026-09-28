import { useEffect, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CaptureModal } from "@/components/landing/CaptureModal";
import { HeroSection } from "@/components/landing/HeroSection";
import { EditorialMarquee } from "@/components/landing/EditorialMarquee";
import { WhyThisGuide } from "@/components/landing/WhyThisGuide";
import { BenefitsGrid } from "@/components/landing/BenefitsGrid";
import { ContentsSection } from "@/components/landing/ContentsSection";
import { WhoIsThisFor } from "@/components/landing/WhoIsThisFor";
import { HonestPledge } from "@/components/landing/HonestPledge";
import { PricingCard } from "@/components/landing/PricingCard";
import { FaqSection } from "@/components/landing/FaqSection";
import { SereneFooter } from "@/components/landing/SereneFooter";
import { useConfig } from "@/lib/useConfig";
import { initSmoothScroll } from "@/lib/scroll";

export default function Home() {
  const config = useConfig();
  const [prenom, setPrenom] = useState<string | null>(() => localStorage.getItem("abondance_prenom"));

  useEffect(() => {
    initSmoothScroll();
  }, []);

  return (
    <div className="grain min-h-screen bg-cream" data-testid="landing-page">
      {!prenom && <CaptureModal onDone={(p) => setPrenom(p)} />}
      <Navbar />
      <main>
        <HeroSection prenom={prenom} />
        <EditorialMarquee />
        <WhyThisGuide />
        <BenefitsGrid />
        <ContentsSection />
        <WhoIsThisFor />
        <HonestPledge />
        <PricingCard config={config} />
        <FaqSection />
      </main>
      <SereneFooter config={config} />
    </div>
  );
}
