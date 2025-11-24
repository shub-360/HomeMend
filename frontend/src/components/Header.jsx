import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Wrench, LogOut, ShieldCheck, Briefcase, User } from "lucide-react";
import BookingDialog from "./BookingDialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Header = () => {
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const { isAdmin, isTechnician, roles, loading } = useUserRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User");
      }
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
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--shadow-primary)] transition-transform duration-300 hover:scale-105 hover:rotate-3">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Home<span className="text-primary">Mend</span>
          </span>
        </button>

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
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <AvatarImage src={session.user?.user_metadata?.avatar_url} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-background/95 backdrop-blur-sm" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-3 p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={session.user?.user_metadata?.avatar_url} alt={userName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{userName}</p>
                        <p className="text-xs text-muted-foreground leading-none">{userEmail}</p>
                      </div>
                    </div>
                    {!loading && roles.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {roles.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role === 'admin' && '👑 Admin'}
                            {role === 'technician' && '🔧 Technician'}
                            {role === 'user' && '👤 Customer'}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Hey {userName.split(" ")[0]}, here's your activity!
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>View Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/edit-profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}
                {isTechnician && (
                  <DropdownMenuItem onClick={() => navigate("/technician")} className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>My Jobs</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => setBookingOpen(true)}
                className="bg-primary hover:bg-primary-glow shadow-[var(--shadow-primary)]"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </header>
  );
};

export default Header;