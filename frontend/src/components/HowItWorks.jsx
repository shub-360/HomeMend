import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Wrench, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "Step 1",
    title: "Select Service",
    description: "Choose from our wide range of repair services and describe your issue",
  },
  {
    icon: Calendar,
    step: "Step 2",
    title: "Book Appointment",
    description: "Pick a convenient time slot that works best for your schedule",
  },
  {
    icon: Wrench,
    step: "Step 3",
    title: "Expert Arrives",
    description: "Our certified technician arrives at your doorstep with all necessary tools",
  },
  {
    icon: CheckCircle,
    step: "Step 4",
    title: "Job Complete",
    description: "Your device is fixed, tested, and ready to use with warranty coverage",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your devices fixed in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 border border-border hover:border-primary/30 bg-card h-full hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="relative">
                    {/* Large step number in background */}
                    <div className="absolute -top-2 -left-2 text-7xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {index + 1}
                    </div>
                    {/* Icon with number badge */}
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-[var(--shadow-primary)] group-hover:shadow-[var(--shadow-glow)]">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    {/* Colored circle badge with step number */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-secondary">{step.step}</p>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary-glow animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;