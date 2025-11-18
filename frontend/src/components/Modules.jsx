import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Wrench as Tool, Shield } from "lucide-react";

const modules = [
  {
    icon: User,
    title: "User Module",
    description: "Register, browse services, book requests, track status, and view service history",
    features: ["Easy Registration", "Service Browsing", "Real-time Tracking", "Service History"],
  },
  {
    icon: Tool,
    title: "Technician Module",
    description: "Manage assigned tasks, accept/reject requests, and update service progress",
    features: ["Job Management", "Request Handling", "Progress Updates", "Customer Communication"],
  },
  {
    icon: Shield,
    title: "Admin Module",
    description: "Approve registrations, manage service categories, and monitor all bookings",
    features: ["User Approval", "Category Management", "Booking Oversight", "Quality Control"],
  },
];

const Modules = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            System <span className="text-primary">Architecture</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Role-based access with dedicated modules for seamless operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Card
              key={index}
              className="group hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-2 border-border/50 hover:border-primary/50 bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[var(--shadow-primary)]">
                  <module.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {module.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modules;