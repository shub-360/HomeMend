// ProtectedRoute.jsx — FINAL PATCHED VERSION
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const ProtectedRoute = ({ children, requiredRole, requireAuth = true }) => {
  const { hasRole, loading: rolesLoading } = useUserRole();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setIsAuthenticated(!!session);
      } catch (err) {
        console.error("ProtectedRoute init error:", err);
        setIsAuthenticated(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;
        setIsAuthenticated(!!nextSession);
      }
    );

    return () => {
      mounted = false;
      try { listener?.subscription?.unsubscribe?.(); } catch (e) {}
    };
  }, []);

  if (isAuthenticated === null || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return <Navigate to="/auth" replace />;

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
