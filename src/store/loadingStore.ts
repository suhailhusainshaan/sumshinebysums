import { create } from 'zustand';

interface LoadingState {
  activeRequests: number;
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  activeRequests: 0,
  isLoading: false,
  show: () =>
    set((state) => {
      const activeRequests = state.activeRequests + 1;
      return {
        activeRequests,
        isLoading: true,
      };
    }),
  hide: () =>
    set((state) => {
      const activeRequests = Math.max(0, state.activeRequests - 1);
      return {
        activeRequests,
        isLoading: activeRequests > 0,
      };
    }),
}));
