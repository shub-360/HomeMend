import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ProtectedRoute = ({ children, requiredRole, requireAuth = true }) => {
  const { hasRole, loading, roles } = useUserRole();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    import("@/lib/supabaseClient").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session);
      });
    });
  }, []);

  if (loading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">
          You don't have permission to access this page.
        </p>
        <p className="text-sm text-muted-foreground">
          Required role: <span className="font-semibold">{requiredRole}</span>
        </p>
        {roles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Your roles: <span className="font-semibold">{roles.join(", ")}</span>
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;