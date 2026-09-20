import { createContext, useContext } from "react";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "configuration-error";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  simulated: boolean;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isDevelopmentFallback: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  return context;
}
