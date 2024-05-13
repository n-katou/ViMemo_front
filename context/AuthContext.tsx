// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => { },
  loading: false,
  loginWithGoogle: async () => { },
  logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, setCurrentUser, loading, loginWithGoogle, logout } = useFirebaseAuth();

  return (
    <AuthCtx.Provider value={{ currentUser, setCurrentUser, loading, loginWithGoogle, logout }}>
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
