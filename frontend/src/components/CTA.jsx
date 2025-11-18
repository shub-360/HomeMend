import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BookingDialog from "./BookingDialog";

const CTA = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-glow to-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/90 leading-relaxed">
            Join thousands of satisfied customers who trust HomeMend for their repair needs. 
            Book your first service today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg"
              onClick={() => setBookingOpen(true)}
              className="bg-background text-primary hover:bg-background/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group text-lg px-8 py-6 h-auto font-semibold"
            >
              Book Your Service
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </section>
  );
};

export default CTA;