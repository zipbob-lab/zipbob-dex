import browserClient from "@/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userId: string | null;
  setUserId: (userId: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setUserId: (id) => set({ userId: id }),
      logout: async () => {
        await browserClient.auth.signOut();
        set({ isLoggedIn: false, userId: null });
      }
    }),
    {
      name: "auth-storage"
    }
  )
);
