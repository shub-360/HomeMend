import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import BookingDialog from "./BookingDialog";
import computerImg from "@/assets/service-computer.jpg";
import tvImg from "@/assets/service-tv.jpg";
import mobileImg from "@/assets/service-mobile.jpg";
import smartHomeImg from "@/assets/service-smarthome.jpg";
import networkingImg from "@/assets/service-networking.jpg";
import washingImg from "@/assets/service-washing.jpg";
import refrigeratorImg from "@/assets/service-refrigerator.jpg";
import electricalImg from "@/assets/service-electrical.jpg";

const services = [
  {
    image: computerImg,
    title: "Computer & Laptop Repairs",
    description:
      "Expert diagnostics, repairs, and hardware upgrades for all systems.",
    highlights: ["On-site Repair", "Same Day Service", "Certified Technicians"],
  },
  {
    image: tvImg,
    title: "TV & Home Theatre",
    description:
      "Professional setup and repair for entertainment  and home cinema.",
    highlights: ["Professional Setup", "All Brands", "Calibration Included"],
  },
  {
    image: mobileImg,
    title: "Mobile & Tablet Repair",
    description:
      "Screen replacement, battery fixes, and software troubleshooting.",
    highlights: ["Quick Turnaround", "Warranty Available", "Genuine Parts"],
  },
  {
    image: smartHomeImg,
    title: "Smart Home Devices",
    description:
      "Installation and configuration of smart locks, cameras, and automation.",
    highlights: ["IoT Experts", "Security Focused", "24/7 Support"],
  },
  {
    image: networkingImg,
    title: "Networking Services",
    description: "WiFi setup, router configuration, and network optimization.",
    highlights: ["Fast & Reliable", "Remote Support", "Enterprise Grade"],
  },
  {
    image: washingImg,
    title: "Washing Machine Repair",
    description:
      "Expert repair and maintenance for all washing machine brands.",
    highlights: ["All Brands", "Parts in Stock", "90-Day Guarantee"],
  },
  {
    image: refrigeratorImg,
    title: "Refrigerator Service",
    description:
      "Cooling issues, compressor repair, and preventive maintenance.",
    highlights: ["Emergency Service", "Licensed Pros", "Energy Efficient"],
  },
  {
    image: electricalImg,
    title: "Electrical Work",
    description:
      "Safe and certified electrical repairs, installations, and inspections.",
    highlights: ["Licensed & Insured", "Code Compliant", "Safety First"],
  },
];

const Services = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [targetPosition, setTargetPosition] = useState({ x: 0.5, y: 0.5 });

  const handleBookNow = (serviceTitle) => {
    setSelectedServiceTitle(serviceTitle);
    setBookingOpen(true);
  };

  // ⭐ Smooth lerp animation using RAF
  useEffect(() => {
    let rafId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      setMousePosition((prev) => ({
        x: lerp(prev.x, targetPosition.x, 0.18),
        y: lerp(prev.y, targetPosition.y, 0.18),
      }));
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetPosition]);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTargetPosition({ x, y });
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
    setTargetPosition({ x: 0.5, y: 0.5 });
  };

  // ⭐ Enhanced 3D Transform with smooth easing
  const getCardTransform = (index) => {
    if (hoveredCard !== index) return {
      transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const tilt = 25; // Reduced tilt for subtle effect
    const rotateX = (mousePosition.y - 0.5) * -tilt;
    const rotateY = (mousePosition.x - 0.5) * tilt;

    return {
      transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  return (
     <section id="services" className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16 animate-ffade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional repair services for all your home and tech needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="
                group overflow-hidden relative
                border border-border bg-card
                hover:border-primary/30
                will-change-transform
              "
              style={{
                animationDelay: `${index * 0.1}s`,
                ...getCardTransform(index),
                transformStyle: "preserve-3d",

                // ⭐ Glow Position Vars
                "--glow-x": `${mousePosition.x * 100}%`,
                "--glow-y": `${mousePosition.y * 100}%`,

                // ⭐ Soft spotlight glow with smooth transition
                background:
                  hoveredCard === index
                    ? `radial-gradient(circle at var(--glow-x) var(--glow-y),
                 rgba(255,255,255,0.25),
                 rgba(167, 66, 255, 0.06),
                 transparent 60%)`
                    : "transparent",

                transition: 'background 0.4s ease-out, border-color 0.3s ease',
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* ⭐ Purple depth shadow with smooth transition */}
              <div 
                className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out"
                style={{
                  boxShadow: hoveredCard === index 
                    ? "0 40px 80px rgba(128, 0, 255, 0.35)" 
                    : "0 0 0 rgba(128, 0, 255, 0)",
                  borderRadius: "inherit",
                  zIndex: -1,
                  opacity: hoveredCard === index ? 1 : 0,
                }}
              />

              {/* ⭐ Glass reflection with smooth parallax */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(
                    ${75 + (mousePosition.x - 0.5) * 30}deg,
                    transparent 0%,
                    rgba(255,255,255,0.35) 35%,
                    rgba(255,255,255,0.15) 50%,
                    transparent 80%
                  )`,
                  transform: `translateX(${(mousePosition.x - 0.5) * 20}px) translateY(${(mousePosition.y - 0.5) * 10}px)`,
                  transition: 'transform 0.3s ease-out',
                }}
              />

              <div
                className="relative h-48 overflow-hidden"
                style={{ transform: "translateZ(20px)" }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              <CardHeader
                className="pb-3"
                style={{ transform: "translateZ(35px)" }}
              >
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/90">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent
                className="pb-3"
                style={{ transform: "translateZ(35px)" }}
              >
                <div className="flex flex-wrap gap-2">
                  {service.highlights.map((highlight, idx) => (
                    <Badge
                      key={idx}
                      variant={idx === 0 ? "feature" : "benefit"}
                      className="transition-transform duration-300 group-hover:scale-105"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter
                className="pt-0"
                style={{ transform: "translateZ(45px)" }}
              >
                <Button
                  onClick={() => handleBookNow(service.title)}
                  className="w-full transition-all duration-300 group-hover:shadow-lg"
                  variant="prominent"
                >
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        preselectedCategory={selectedServiceTitle}
      />
    </section>
  );
};

export default Services;