import { create } from "zustand";

type LikeStore = {
  likeCount: number;
  setLikeCount: (count: number) => void;
  isLike: boolean;
  toggleLike: () => void;
};

export const useLikeStore = create<LikeStore>((set) => ({
  likeCount: 0,
  isLike: false,
  toggleLike: () =>
    set((state) => ({
      isLike: !state.isLike,
      likeCount: state.isLike ? state.likeCount - 1 : state.likeCount + 1
    })),
  setLikeCount: (count: number) => set({ likeCount: count })
}));
