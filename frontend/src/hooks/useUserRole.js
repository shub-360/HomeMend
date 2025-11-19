import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";

export const useUserRole = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRoles([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setRoles([]);
        } else {
          setRoles(data?.map(r => r.role) || []);
        }
      } catch (error) {
        console.error('Error in fetchUserRoles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isTechnician = hasRole('technician');
  const isUser = hasRole('user');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isTechnician,
    isUser,
  };
};