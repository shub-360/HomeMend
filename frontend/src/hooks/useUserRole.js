import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useUserRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        // 1️⃣ Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setRoles([]);
          setLoading(false);
          return;
        }

        // 2️⃣ TRY RPC version first
        let { data: rpcRoles, error: rpcError } = await supabase.rpc(
          "get_user_roles",
          { _user_id: user.id }
        );

        if (!rpcError && Array.isArray(rpcRoles)) {
          setRoles(rpcRoles);
          setLoading(false);
          return;
        }

        // 3️⃣ Fallback: Select from table if RPC is not working
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          setRoles([]);
        } else {
          setRoles(data?.map((r) => r.role) || []);
        }
      } catch (error) {
        console.error("Error in fetchUserRoles:", error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();

    // 4️⃣ Re-run roles when auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserRoles();
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  // 5️⃣ Helper functions
  const hasRole = (role) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const isTechnician = hasRole("technician");
  const isUser = hasRole("user");

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isTechnician,
    isUser,
  };
};
