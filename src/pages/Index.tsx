
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Boxes } from "@/components/ui/background-boxes";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Background with boxes and gradient mask - exact implementation from 21st dev */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <div className="absolute inset-0 z-10">
        <Boxes />
      </div>
      
      <Navbar />
      <main className="flex-grow relative z-30">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
