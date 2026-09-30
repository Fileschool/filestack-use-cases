import { IBaseEntity } from './common.interface';

export type UserRole = 'client' | 'admin' | 'architect';

export interface IUser extends IBaseEntity {
  email: string;
  name: string;
  company?: string;
  role: UserRole;
  avatar?: string;
}

export interface ILoginCredentials {
  email: string;
  role: UserRole;
}

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: IUser) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}
