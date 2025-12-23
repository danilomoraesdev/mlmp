/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService, getStoredTokens, clearStoredTokens } from "@/services";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "mlmp_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage synchronously
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação no mount
  useEffect(() => {
    const checkAuth = async () => {
      const tokens = getStoredTokens();
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      } catch {
        // Token inválido ou expirado
        clearStoredTokens();
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    } catch {
      // Silenciosamente falha
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
