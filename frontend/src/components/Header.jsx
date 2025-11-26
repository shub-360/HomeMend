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
  const [profile, setProfile] = useState(null); // <- profile from profiles table
  const { isAdmin, isTechnician, roles, loading } = useUserRole();

  // Fetch session + profile on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(currentSession || null);

      if (currentSession?.user) {
        const u = currentSession.user;
        setUserEmail(u.email || "");
        setUserName(
          u.user_metadata?.full_name ||
            u.email?.split("@")[0] ||
            "User"
        );

        // fetch profile row from profiles table
        await fetchProfile(u.id);
      }
    };

    load();

    // subscribe to auth changes (sign in / sign out)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession || null);
        if (nextSession?.user) {
          const u = nextSession.user;
          setUserEmail(u.email || "");
          setUserName(
            u.user_metadata?.full_name ||
              u.email?.split("@")[0] ||
              "User"
          );
          await fetchProfile(u.id);
        } else {
          setProfile(null);
          setUserEmail("");
          setUserName("");
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Realtime subscription to profiles changes for the logged-in user
  useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;

    const channel = supabase
      .channel(`profile-updates-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            // Merge the new profile values
            setProfile((prev) => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      // clean up
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const fetchProfile = async (userId) => {
    try {
      if (!userId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch profile:", error);
        return;
      }
      if (data) setProfile(data);
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    // profile/session state will be cleared by auth listener
  };

  // Choose avatar: prefer DB profile.avatar_url, fallback to auth metadata
  const avatarSrc =
    profile?.avatar_url ||
    session?.user?.user_metadata?.avatar_url ||
    undefined;

  const displayName =
    profile?.full_name ||
    userName ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split("@")[0] ||
    "User";

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
          <a
            href="#services"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Services
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </a>
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
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <AvatarImage src={avatarSrc} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-72 bg-background/95 backdrop-blur-sm" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-3 p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={avatarSrc} alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{displayName}</p>
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
                      Hey {displayName.split(" ")[0]}, here's your activity!
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
