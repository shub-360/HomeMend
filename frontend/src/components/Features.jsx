import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Verified Technicians",
    description: "All our service providers are thoroughly vetted and certified professionals",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Track your service request status and technician location in real-time",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Secure payments, transparent pricing, and clear communication throughout",
  },
  {
    icon: CheckCircle2,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee with post-service support and warranty",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose <span className="text-primary">HomeMend</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A seamless experience from booking to completion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center group hover:shadow-[var(--shadow-card)] hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-8 pb-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;