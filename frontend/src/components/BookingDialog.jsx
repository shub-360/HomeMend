import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Tv,
  Wrench,
  Home,
  Camera,
  Dumbbell,
  ArrowLeft,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  CalendarIcon,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  date: z.date({ required_error: "Please select a preferred date" }),
  time: z.string().trim().min(1, "Please select a preferred time"),
});

const serviceCategories = [
  {
    id: "computer",
    icon: Laptop,
    title: "Computer & Laptop Repairs",
    description:
      "Expert diagnostics and repairs for all computer and laptop issues",
    price: "₹499",
    duration: "1-2 hours",
    popular: true,
    included: [
      "Hardware diagnostics",
      "Software repair",
      "Performance optimization",
    ],
    subcategories: [
      "Laptop Cleaning & Maintenance",
      "Hardware Repair & Replacement",
      "Software Installation & Updates",
      "Virus Removal & Security",
      "Data Recovery",
      "Screen Replacement",
      "Battery Replacement",
      "Performance Optimization",
    ],
  },
  {
    id: "tv",
    icon: Tv,
    title: "TV & Home Theatre",
    description:
      "Professional setup and repair services for your entertainment systems",
    price: "₹599",
    duration: "2-3 hours",
    popular: false,
    included: ["Installation & setup", "Screen repair", "Cable management"],
    subcategories: [
      "TV Installation & Setup",
      "Screen Repair",
      "Sound System Installation",
      "Remote Configuration",
      "Cable Management",
      "Smart TV Setup",
      "Streaming Device Setup",
    ],
  },
  {
    id: "mobile",
    icon: Wrench,
    title: "Mobile & Tablet Repair",
    description:
      "Screen replacement, battery fixes, and software troubleshooting",
    price: "₹399",
    duration: "1-2 hours",
    popular: true,
    included: ["Quick turnaround", "Warranty available", "Genuine parts"],
    subcategories: [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
      "Software Troubleshooting",
      "Water Damage Repair",
      "Camera Repair",
      "Speaker & Microphone Repair",
    ],
  },
  {
    id: "smarthome",
    icon: Home,
    title: "Smart Home Devices",
    description:
      "Installation and configuration of smart locks, cameras, and automation",
    price: "₹699",
    duration: "2-4 hours",
    popular: false,
    included: ["IoT experts", "Security focused", "24/7 support"],
    subcategories: [
      "Smart Lock Installation",
      "Security Camera Setup",
      "Smart Thermostat Installation",
      "Voice Assistant Setup",
      "Smart Lighting Installation",
      "Home Automation Setup",
      "Smart Doorbell Installation",
    ],
  },
  {
    id: "networking",
    icon: Camera,
    title: "Networking Services",
    description: "WiFi setup, router configuration, and network optimization",
    price: "₹499",
    duration: "1-3 hours",
    popular: false,
    included: ["Fast & reliable", "Remote support", "Enterprise grade"],
    subcategories: [
      "WiFi Router Setup",
      "Network Configuration",
      "Range Extender Installation",
      "Network Security Setup",
      "Ethernet Cabling",
      "Mesh Network Setup",
      "Network Troubleshooting",
    ],
  },
  {
    id: "washing",
    icon: Dumbbell,
    title: "Washing Machine Repair",
    description: "Expert repair and maintenance for all washing machine brands",
    price: "₹599",
    duration: "2-3 hours",
    popular: true,
    included: ["All brands", "Parts in stock", "90-day guarantee"],
    subcategories: [
      "Drum Repair",
      "Motor Replacement",
      "Water Inlet/Outlet Repair",
      "Control Panel Repair",
      "Door Lock Replacement",
      "Preventive Maintenance",
      "Deep Cleaning Service",
    ],
  },
  {
    id: "refrigerator",
    icon: Wrench,
    title: "Refrigerator Service",
    description:
      "Cooling issues, compressor repair, and preventive maintenance",
    price: "₹699",
    duration: "2-4 hours",
    popular: false,
    included: ["Emergency service", "Licensed pros", "Energy efficient"],
    subcategories: [
      "Cooling Issues",
      "Compressor Repair",
      "Thermostat Replacement",
      "Gas Refilling",
      "Ice Maker Repair",
      "Door Seal Replacement",
      "Preventive Maintenance",
    ],
  },
  {
    id: "electrical",
    icon: Wrench,
    title: "Electrical Work",
    description:
      "Safe and certified electrical repairs, installations, and inspections",
    price: "₹799",
    duration: "2-5 hours",
    popular: false,
    included: ["Licensed & insured", "Code compliant", "Safety first"],
    subcategories: [
      "Wiring & Rewiring",
      "Switch & Socket Installation",
      "Circuit Breaker Repair",
      "Light Fixture Installation",
      "Ceiling Fan Installation",
      "Electrical Safety Inspection",
      "Emergency Electrical Repairs",
    ],
  },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const BookingDialog = ({ open, onOpenChange, preselectedCategory }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const selectedTime = watch("time");

  // Find the category that matches the preselected one
  const filteredCategory = preselectedCategory
    ? serviceCategories.find((cat) => cat.title === preselectedCategory)
    : null;

  const handleServiceSelect = (service, category) => {
    setSelectedService({ service, category });
  };

  const handleBack = () => {
    setSelectedService(null);
    setSelectedDate(undefined);
    reset();
  };

  const onSubmit = (data) => {
    toast.success("Booking Confirmed!", {
      description: `Your appointment for ${
        selectedService?.service
      } has been scheduled for ${format(data.date, "PPP")} at ${data.time}`,
    });
    setTimeout(() => {
      onOpenChange(false);
      handleBack();
    }, 2000);
  };
  const handleAddToCart = async (data) => {
    if (!selectedService) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const priceString = selectedService.category.price.replace("₹", "");
    const price = parseFloat(priceString);

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      service_type: selectedService.service,
      price: price,
      scheduled_date: data.date.toISOString(),
      preferred_time: data.time,
      customer_name: data.fullName,
      customer_phone: data.phone,
      customer_address: data.address,
    });

    if (error) {
      toast.error("Failed to add to cart");
      console.error(error);
      return;
    }

    toast.success("Added to Cart!", {
      description: `${selectedService.service} has been added to your cart`,
    });

    setTimeout(() => {
      onOpenChange(false);
      handleBack();
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          handleBack();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {selectedService ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span>Book {selectedService.service}</span>
              </div>
            ) : (
              <span>Select Your Service</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedService
              ? "Fill in your details to book this service"
              : "Choose from our wide range of professional services"}
          </DialogDescription>
        </DialogHeader>

        {!selectedService ? (
          <div className="mt-4 space-y-6">
            {(filteredCategory ? [filteredCategory] : serviceCategories).map(
              (category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--shadow-primary)]">
                      <category.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {category.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.subcategories.map((service, index) => (
                      <button
                        key={index}
                        onClick={() => handleServiceSelect(service, category)}
                        className="group relative flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 bg-card/50 hover:bg-accent/50 transition-all duration-300 text-left hover:shadow-[var(--shadow-card)]"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {service}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Professional service with verified technicians
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
            {/* Service Details Card */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">
                    {selectedService.service}
                  </CardTitle>
                  {selectedService.category.popular && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {selectedService.category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-lg">
                    {selectedService.category.price}
                  </span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {selectedService.category.duration}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.category.included.map((item, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-background/50"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Service Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter complete address where service is needed"
                rows={3}
                {...register("address")}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Preferred Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) setValue("date", date);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Time
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedTime && "text-muted-foreground"
                      )}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedTime || "Select time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    portal={true}
                    initialFocus
                    className="w-full p-0 z-[99999] pointer-events-auto bg-popover shadow-xl border rounded-md"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                  >
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setValue("time", time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.time && (
                  <p className="text-sm text-red-500">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleSubmit(handleAddToCart)}
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              <Button type="submit" className="flex-1" size="lg">
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
