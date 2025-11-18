import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;