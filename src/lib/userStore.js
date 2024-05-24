import { create } from "zustand";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      set({ currentUser: docSnap.data(), isLoading: false });
    } else {
      set({ currentUser: null, isLoading: false });
    }
    try {
    } catch (error) {
      console.log("userStoreError", error);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
