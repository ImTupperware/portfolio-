import { create } from "zustand";

interface UIState {
  // Modal & Drawer visibility
  isContactModalOpen: boolean;
  isMobileNavOpen: boolean;
  isAiChatOpen: boolean;
  isResumeUploadOpen: boolean;

  // Active item preview inspection
  activeProjectPreviewSlug: string | null;

  // Actions
  openContactModal: () => void;
  closeContactModal: () => void;
  openAiChat: () => void;
  closeAiChat: () => void;
  toggleAiChat: () => void;
  openResumeUpload: () => void;
  closeResumeUpload: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
  setActiveProjectPreviewSlug: (slug: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isContactModalOpen: false,
  isMobileNavOpen: false,
  isAiChatOpen: false,
  isResumeUploadOpen: false,
  activeProjectPreviewSlug: null,

  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),
  openAiChat: () => set({ isAiChatOpen: true }),
  closeAiChat: () => set({ isAiChatOpen: false }),
  toggleAiChat: () => set((state) => ({ isAiChatOpen: !state.isAiChatOpen })),
  openResumeUpload: () => set({ isResumeUploadOpen: true }),
  closeResumeUpload: () => set({ isResumeUploadOpen: false }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  setActiveProjectPreviewSlug: (slug) => set({ activeProjectPreviewSlug: slug }),
}));
