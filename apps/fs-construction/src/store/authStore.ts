import { create } from 'zustand';
import { IUser, UserRole } from '@/interfaces/user.interface';
import { INITIAL_DEMO_USERS } from '@/lib/constants';

interface IAuthState {
  user: IUser | null;
  role: UserRole;
  isAuthenticated: boolean;
}

interface IAuthActions {
  setUser: (user: IUser | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
  switchToAdmin: () => void;
  switchToClient: () => void;
}

// Demo runs pre-authenticated as the client user; /login just switches role.
const DEMO_CLIENT = INITIAL_DEMO_USERS.find((u) => u.role === 'client')!;

export const useAuthStore = create<IAuthState & IAuthActions>((set) => ({
  user: DEMO_CLIENT,
  role: 'client',
  isAuthenticated: true,

  setUser: (user) =>
    set({
      user,
      role: user?.role ?? 'client',
      isAuthenticated: Boolean(user),
    }),

  setRole: (role) =>
    set((state) => {
      const matchUser = INITIAL_DEMO_USERS.find((u) => u.role === role) || {
        id: `user-${role}-demo`,
        name: role === 'admin' ? 'Marcus Vance' : 'Jane Doe',
        email: role === 'admin' ? 'marcus.vance@apexcad.com' : 'jane.doe@horizondevelopments.com',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        role,
        user: matchUser,
        isAuthenticated: true,
      };
    }),

  logout: () =>
    set({
      user: DEMO_CLIENT,
      role: 'client',
      isAuthenticated: true,
    }),

  switchToAdmin: () =>
    set({
      role: 'admin',
      user: INITIAL_DEMO_USERS[0],
      isAuthenticated: true,
    }),

  switchToClient: () =>
    set({
      role: 'client',
      user: INITIAL_DEMO_USERS[1],
      isAuthenticated: true,
    }),
}));

export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useActiveRole = () => useAuthStore((state) => state.role);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
