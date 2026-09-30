'use client';

import { FC, ReactNode, createContext, useContext } from 'react';
import { useAuthStore } from '@/store/authStore';
import { IUser, UserRole } from '@/interfaces/user.interface';

interface IAuthContextType {
  user: IUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const { user, role, isAuthenticated, setRole, logout } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
