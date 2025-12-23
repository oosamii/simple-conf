'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@simpleconf/shared';
import { authService, type RegisterInput } from '../api/services/auth';
import { clearAuthToken, getAuthToken, setAuthToken } from '../api/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authService
        .getMe()
        .then(setUser)
        .catch(() => clearAuthToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    setAuthToken(token);
    setUser(user);
    router.push('/');
  }, [router]);

  const register = useCallback(async (data: RegisterInput) => {
    await authService.register(data);
    // After registration, auto-login
    const { token, user } = await authService.login(data.email, data.password);
    setAuthToken(token);
    setUser(user);
    router.push('/');
  }, [router]);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
