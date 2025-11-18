import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import BookingDialog from "./BookingDialog";

const Hero = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Premium diagonal gradient with depth */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(262_83%_68%)_0%,hsl(280_90%_75%)_30%,hsl(262_90%_95%)_60%,hsl(0_0%_100%)_100%)] dark:bg-[linear-gradient(135deg,hsl(262_83%_48%)_0%,hsl(280_90%_55%)_30%,hsl(240_10%_10%)_60%,hsl(240_10%_3.9%)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(262_83%_68%/0.3),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(290_85%_70%/0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(240_6%_90%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(240_6%_90%/0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(240_6%_90%/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(240_6%_90%/0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="HomeMend Services" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle foreground elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle tool icons scattered */}
        <Wrench className="absolute top-1/4 left-1/4 w-12 h-12 text-primary opacity-[0.06] rotate-12" />
        <Wrench className="absolute bottom-1/3 right-1/4 w-16 h-16 text-primary opacity-[0.05] -rotate-45" />
        <Wrench className="absolute top-2/3 left-1/3 w-10 h-10 text-primary opacity-[0.07] rotate-90" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 shadow-[0_8px_16px_hsl(262_83%_58%/0.15)]">
            <Wrench className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Professional Home & Tech Repair Services</span>
          </div>

          {/* Main heading with cinematic glow */}
          <div className="relative">
            {/* Soft radial glow behind heading */}
            <div className="absolute inset-0 -top-8 -bottom-8 flex items-center justify-center">
              <div className="w-[600px] h-[300px] bg-primary/30 dark:bg-primary/20 blur-[100px] rounded-full" />
            </div>
            <h1 className="relative text-[2.75rem] md:text-6xl lg:text-7xl font-bold tracking-[0.02em] leading-[1.2] space-y-2">
              <span className="block bg-gradient-to-r from-primary via-[hsl(280_90%_65%)] to-[hsl(290_85%_70%)] bg-clip-text text-transparent drop-shadow-[0_0_40px_hsl(262_83%_58%/0.4)] animate-gradient bg-[length:200%_auto]">
                We Mend,
              </span>
              <span className="block text-foreground font-extrabold mt-2">You Rest.</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with verified technicians for home and tech repair services. 
            From appliance maintenance to laptop servicing—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {/* Subtle glow accent behind buttons */}
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150 -z-10" />
            <Button 
              size="lg" 
              onClick={() => setBookingOpen(true)}
              className="group bg-primary hover:bg-primary-glow shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:scale-105 text-lg px-8 py-6 h-auto font-semibold"
            >
              Book a Service
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setBookingOpen(true)}
              className="border border-border hover:bg-muted transition-all duration-300 text-base"
            >
              View Services
            </Button>
          </div>

          <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Technicians</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Services Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;