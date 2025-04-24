import { GeoPoint } from 'firebase/firestore';
import { create } from 'zustand';
import { auth } from '../firebase/config';
import { signOut } from '@firebase/auth';

type User = {
  id: string,
  userType?: string,
  email?: string,
  image?: string,
  name?: string,
  complement?: string,
  createdAt?: number,
  establishmentName?: string,
  cep?: string,
  state?: string,
  city?: string,
  neighborhood?: string,
  street?: string,
  number?: string,
  addressGeocode?: GeoPoint,
  lastLocation?: {
    latitude: number,
    longitude: number,
    description: string
  }
}

interface UserState {
  user: User | null;
  setUser: (userData: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,

    setUser: (userData: User) => set({user: userData}),

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    },
}));

export default useUserStore;