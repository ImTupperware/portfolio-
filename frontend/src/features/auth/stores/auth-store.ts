import { create } from "zustand";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  title?: string;
  summary?: string;
  location?: string;
  availability?: string;
  phone?: string;
  whatsapp?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isEditMode: boolean;
  isLoginModalOpen: boolean;

  login: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
  toggleEditMode: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isEditMode: false,
  isLoginModalOpen: false,

  login: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
    set({ token, user, isEditMode: true, isLoginModalOpen: false });
  },

  updateUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    set({ token: null, user: null, isEditMode: false });
  },

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    const userJson = localStorage.getItem("auth_user");
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as AuthUser;
        set({ token, user, isEditMode: true });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  },
}));
