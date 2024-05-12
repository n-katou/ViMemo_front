// context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import useFirebaseAuth from "hooks/useFirebaseAuth";
import { User } from "firebase/auth";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void; // 現在のユーザーを設定する関数
  loading: boolean;
  loginWithGoogle: () => Promise<User | undefined>;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { currentUser, setUser, loading, loginWithGoogle, logout } = useFirebaseAuth();

  const setCurrentUser = (user: User | null) => {
    setUser(user); // useFirebaseAuth から setUser を呼び出し
  };

  return (
    <AuthCtx.Provider value={{ currentUser, setCurrentUser, loading, loginWithGoogle, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

// カスタムフックを提供してコンテキストを使用しやすくする
export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
