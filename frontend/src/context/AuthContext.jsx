import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial Session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);

      if (sessionUser) fetchProfile(sessionUser.id);

      setLoading(false);
    };
    getSession();

    // Listen to login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) fetchProfile(currentUser.id);
        else setProfile(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (id) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setProfile(data);
  };

  const signup = async ({ email, password, full_name, mobile }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data?.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          full_name,
          mobile,
          role: "user", // default
        },
      ]);
    }

    return { data, error };
  };

  const login = ({ email, password }) =>
    supabase.auth.signInWithPassword({ email, password });

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
