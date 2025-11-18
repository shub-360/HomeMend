import { Card, CardContent } from "@/components/ui/card";
import { Code2, Database, Lock, Server, Paintbrush, CreditCard } from "lucide-react";

const techCategories = [
  {
    icon: Code2,
    category: "Frontend",
    tech: "React.js, JavaScript",
  },
  {
    icon: Server,
    category: "Backend",
    tech: "Node.js, Express.js",
  },
  {
    icon: Database,
    category: "Database",
    tech: "MongoDB, MySQL",
  },
  {
    icon: Lock,
    category: "Authentication",
    tech: "JWT, bcrypt",
  },
  {
    icon: CreditCard,
    category: "Payments",
    tech: "Razorpay API",
  },
  {
    icon: Paintbrush,
    category: "Design",
    tech: "Figma, Sketch",
  },
];

const TechStack = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Built with <span className="text-primary">Modern Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scalable, secure, and reliable infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {techCategories.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-[var(--shadow-card)] transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.tech}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;