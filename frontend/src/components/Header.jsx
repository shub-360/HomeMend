import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
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
  const [profile, setProfile] = useState(null);

  const { isAdmin, isTechnician, roles, loading } = useUserRole();

  // ---------------------------
  // Load session ONCE
  // ---------------------------
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(s);
      if (s?.user) fetchProfile(s.user.id);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // ---------------------------
  // Fetch profile ONCE
  // ---------------------------
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  };

  // ---------------------------
  // REALTIME profile updates
  // ---------------------------
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setProfile((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  // ---------------------------
  // Display info
  // ---------------------------
  const avatarSrc = profile?.avatar_url || undefined;

  const displayName =
    profile?.full_name || session?.user?.email?.split("@")[0] || "User";

  const userEmail = session?.user?.email || "";

  // ---------------------------
  // Sign Out
  // ---------------------------
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error(error);

      setSession(null);
      setProfile(null);
      supabase.removeAllChannels?.();

      navigate("/");
    } catch (err) {
      console.error("Sign out failed: ", err);
    }
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
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </button>

          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Button>
          )}

          {isTechnician && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/technician")}
              className="gap-2"
            >
              <Briefcase className="w-4 h-4" />
              My Jobs
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
                  <Avatar className="h-10 w-10 border border-primary/30">
                    <AvatarImage src={avatarSrc} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-72 bg-background/95 backdrop-blur-sm"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-3 p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-primary/20 border">
                        <AvatarImage src={avatarSrc} alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm font-semibold leading-none">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {!loading && roles.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs"
                          >
                            {role === "admin" && "👑 Admin"}
                            {role === "technician" && "🔧 Technician"}
                            {role === "user" && "👤 Customer"}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="w-4 h-4 mr-2" /> Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                  <User className="w-4 h-4 mr-2" /> Edit Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="cursor-pointer"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                )}

                {isTechnician && (
                  <DropdownMenuItem
                    onClick={() => navigate("/technician")}
                    className="cursor-pointer"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>My Jobs</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => setBookingOpen(true)}
                className="bg-primary hover:bg-primary-glow"
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
