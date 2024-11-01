import { create } from "zustand";

type LikeStore = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  likeCount: number;
  setLikeCount: (count: number) => void;
  isLike: boolean;
  toggleLike: () => void;
};

export const useLikeStore = create<LikeStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  likeCount: 0,
  isLike: false,
  toggleLike: () =>
    set((state) => ({
      isLike: !state.isLike,
      likeCount: state.isLike ? state.likeCount - 1 : state.likeCount + 1
    })),
  setLikeCount: (count: number) => set({ likeCount: count })
}));
