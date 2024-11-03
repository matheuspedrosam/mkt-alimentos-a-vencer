import { create } from 'zustand';

type User = {
  id: string,
  userType?: string,
  email?: string,
  name?: string,
  complement?: string,
  createdAt?: number,
  establishmentName?: string,
  number?: string,
  state?: string,
  street?: string,
}

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