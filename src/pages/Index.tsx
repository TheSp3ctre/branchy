import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import TimeSection from "@/components/TimeSection";
import SolutionSection from "@/components/SolutionSection";
import ComparisonSection from "@/components/ComparisonSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <TimeSection />
        <SolutionSection />
        <ComparisonSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
