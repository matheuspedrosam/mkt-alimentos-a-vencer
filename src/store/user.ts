import { create } from 'zustand';
import { User, UserCredential } from '@firebase/auth';

interface UserState {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (userData: User) => set({user: userData}),

  logout: () => set({ user: null }),
}));

export default useUserStore;