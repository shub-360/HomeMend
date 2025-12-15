import { Wrench, Facebook, Twitter, Instagram, Linkedin, Mail, Shield, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
     <footer id="about" className="border-t border-border/40 bg-[hsl(var(--footer-background))] relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:pointer-events-none">
      <div className="container px-4 py-16">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 pb-12 border-b border-border/40">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">10K+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-semibold">100% Secure Service</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold">Certified Technicians</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--shadow-primary)]">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Home<span className="text-primary">Mend</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional home and tech repair services at your doorstep. Trusted by thousands.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-2 pt-2">
              <p className="text-sm font-semibold">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1"
                />
                <Button className="bg-primary hover:bg-primary-glow">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Get updates on offers and services</p>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Computer Repair</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Appliances</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Smart Home</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">TV & Theatre</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Partner With Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2025 HomeMend. All rights reserved. Built by Shubham Sharma</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;