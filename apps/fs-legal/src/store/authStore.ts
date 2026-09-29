import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IStaffUser {
  name: string;
  role: string;
  email: string;
}

interface IAuthState {
  user: IStaffUser | null;
  isAuthenticated: boolean;
}

interface IAuthActions {
  signIn: (user: IStaffUser) => void;
  signOut: () => void;
}

/**
 * Staff sign-in is emulated. Picking an account stores it locally; there are
 * no passwords. This demonstrates the file workflow, not authentication.
 */
export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'staff-session' }
  )
);
