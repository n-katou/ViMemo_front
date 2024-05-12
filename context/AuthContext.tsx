// context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import useFirebaseAuth from "hooks/useFirebaseAuth";
import { User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | undefined>;
  logout: () => Promise<void>;
  updateAuthState: (user: User | null) => void; // ユーザー情報を更新する関数を追加
  setUser: (user: User | null) => void;
}

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { currentUser, loading, loginWithGoogle, logout, setUser } = useFirebaseAuth();

  const updateAuthState = (user: User | null) => {
    setUser(user);
  };

  return (
    <AuthCtx.Provider value={{ currentUser, loading, loginWithGoogle, logout, updateAuthState, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

// カスタムフックを提供してコンテキストを使用しやすくする
export function useAuth() {
  const context = useContext(AuthCtx);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
