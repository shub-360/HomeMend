import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import BookingDialog from "./BookingDialog";

const Hero = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* 1. BASE GRADIENT */}
      <div className="absolute inset-0 
        bg-[linear-gradient(135deg,
            hsl(265_70%_75%)_0%,
            hsl(275_80%_82%)_40%,
            hsl(285_90%_90%)_70%,
            hsl(295_95%_97%)_100%
        )]
      " />

      {/* 2. GLOW */}
      <div className="absolute inset-0
        bg-[radial-gradient(circle_at_50%_35%,
            hsl(0_0%_100%/0.45) 0%,
            transparent 60%
        )]
      " />

      {/* 3. BLOBS */}
      <div className="absolute bottom-[-100px] right-[-80px] 
        w-[350px] h-[350px]
        bg-[hsl(265_85%_70%)]
        blur-[120px] opacity-40
      " />

      <div className="absolute top-[-80px] left-[-60px] 
        w-[260px] h-[260px]
        bg-[hsl(280_80%_78%)]
        blur-[110px] opacity-35
      " />

      {/* 4. PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="particle absolute w-2 h-2 bg-white/30 rounded-full blur-[2px] top-[20%] left-[25%]" />
        <div className="particle absolute w-1.5 h-1.5 bg-white/20 rounded-full blur-[1px] top-[60%] left-[40%]" />
        <div className="particle absolute w-2 h-2 bg-white/25 rounded-full blur-[2px] top-[35%] left-[70%]" />
        <div className="particle absolute w-2 h-2 bg-white/20 rounded-full blur-[1px] top-[75%] left-[15%]" />
        <div className="particle absolute w-1.5 h-1.5 bg-white/25 rounded-full blur-[1px] top-[10%] left-[82%]" />
      </div>

      {/* 5. GRID */}
      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),
            linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
        bg-[size:36px_36px]
      " />

      {/* 6. HERO IMAGE — COMMENTED OUT */}
      
      {/* <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage}
          alt="HomeMend Services"
          className="w-full h-full object-cover"
        />
      </div>
      */}

      {/* 7. TOOL ICONS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Wrench className="absolute top-1/4 left-1/4 w-12 h-12 text-primary opacity-[0.06] rotate-12" />
        <Wrench className="absolute bottom-1/3 right-1/4 w-16 h-16 text-primary opacity-[0.05] -rotate-45" />
        <Wrench className="absolute top-2/3 left-1/3 w-10 h-10 text-primary opacity-[0.07] rotate-90" />
      </div>

      {/* 8. CONTENT */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-primary/20 shadow-[0_8px_16px_hsl(262_83%_58%/0.15)]">
            <Wrench className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Professional Home & Tech Repair Services
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -top-8 -bottom-8 flex items-center justify-center">
              <div className="w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full" />
            </div>

            <h1 className="relative text-[2.75rem] md:text-6xl lg:text-7xl font-bold leading-[1.2]">
              <span className="block bg-gradient-to-r from-primary via-[hsl(280_90%_65%)] to-[hsl(290_85%_70%)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                We Mend,
              </span>
              <span className="block text-foreground font-extrabold mt-2">
                You Rest.
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified technicians for home and tech repair services. 
            From appliance maintenance to laptop servicing—all in one place.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150 -z-10" />

            <Button 
              size="lg"
              onClick={() => setBookingOpen(true)}
              className="group bg-primary hover:bg-primary-glow transition-all duration-300 hover:scale-105 text-lg px-8 py-6 h-auto font-semibold"
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

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Technicians</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Services Completed</div>
            </div>
            <div>
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
