import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  avatar_url?: string | null;
};

type AuthValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  updateProfileAvatar: (url: string | null) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  refresh: async () => { },
  updateProfileAvatar: async () => { },
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUserData(userId: string | undefined, userObj?: User | null) {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    try {
      const [{ data: prof }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);

      // Resolve avatar from user_metadata, database profile, or persistent localStorage
      const cachedAvatar =
        typeof window !== "undefined"
          ? localStorage.getItem(`infratrack_avatar_${userId}`)
          : null;
      const metaAvatar =
        userObj?.user_metadata?.avatar_url ??
        session?.user?.user_metadata?.avatar_url ??
        (prof as Record<string, unknown> | null)?.avatar_url ??
        cachedAvatar ??
        null;

      const resolvedProfile: Profile = {
        ...(prof as Profile || {
          id: userId,
          full_name: userObj?.user_metadata?.full_name || "Citizen Account",
          email: userObj?.email || "",
          phone: null,
          created_at: new Date().toISOString(),
        }),
        avatar_url: metaAvatar as string | null,
      };

      setProfile(resolvedProfile);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    } catch (err) {
      console.warn("Could not load full user data:", err);
    }
  }

  async function updateProfileAvatar(url: string | null) {
    const userId = session?.user?.id;
    if (!userId) return;

    // 1. Immediately update local React context state for zero-latency UI
    setProfile((prev) => (prev ? { ...prev, avatar_url: url } : null));

    // 2. Persist in localStorage for instant retrieval across browser sessions
    if (typeof window !== "undefined") {
      if (url) {
        localStorage.setItem(`infratrack_avatar_${userId}`, url);
      } else {
        localStorage.removeItem(`infratrack_avatar_${userId}`);
      }
    }

    // 3. Persist in Supabase Auth user metadata (survives logging out and logging back in)
    try {
      await supabase.auth.updateUser({
        data: { avatar_url: url },
      });
    } catch (err) {
      console.warn("Could not update auth user metadata:", err);
    }

    // 4. Also attempt to save to `profiles` table in database
    try {
      await supabase
        .from("profiles")
        .update({ avatar_url: url } as Record<string, unknown>)
        .eq("id", userId);
    } catch {
      // Safe to ignore if column is not on database schema
    }
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Never call other supabase APIs directly inside the callback.
      setTimeout(() => void loadUserData(next?.user?.id, next?.user), 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadUserData(data.session?.user?.id, data.session?.user);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthValue = {
    session,
    user: session?.user ?? null,
    profile,
    isAdmin,
    loading,
    refresh: () => loadUserData(session?.user?.id, session?.user),
    updateProfileAvatar,
    signOut: async () => {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAdmin(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
