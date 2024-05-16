import React, { createContext, useContext, ReactNode } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { AuthState } from "../types/AuthState";
import { CustomUser } from "@/types/user";

interface AuthContextType {
  currentUser: CustomUser | null;
  jwtToken: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthState: (state: AuthState) => void;
}

const AuthCtx = createContext<AuthContextType>({
  currentUser: null,
  jwtToken: null,
  loading: false,
  loginWithGoogle: async () => { },
  logout: async () => { },
  setAuthState: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();

  return (
    <AuthCtx.Provider value={auth}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthCtx);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
