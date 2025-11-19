import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Wrench, LogOut, ShieldCheck, Briefcase } from "lucide-react";
import BookingDialog from "./BookingDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [session, setSession] = useState(null);
  const { isAdmin, isTechnician, roles, loading } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--shadow-primary)] transition-transform duration-300 hover:scale-105 hover:rotate-3">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Home<span className="text-primary">Mend</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 flex-1 ml-8">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Services
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="gap-2">
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Button>
          )}
          {isTechnician && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/technician")} className="gap-2">
              <Briefcase className="w-4 h-4" />
              My Jobs
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session && !loading && roles.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role === 'admin' && '👑 Admin'}
                  {role === 'technician' && '🔧 Technician'}
                  {role === 'user' && '👤 Customer'}
                </Badge>
              ))}
            </div>
          )}
          {session ? (
            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={() => setBookingOpen(true)}
            className="bg-primary hover:bg-primary-glow shadow-[var(--shadow-primary)]"
          >
            Get Started
          </Button>
        </div>
      </div>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </header>
  );
};

export default Header;