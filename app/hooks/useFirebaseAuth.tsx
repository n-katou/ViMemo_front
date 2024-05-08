"use client";

import { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential, signOut, User } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBTeINHuytWKsQdYLQn9WNqRwHKzwTUFA",
  authDomain: "vimemo-63237.firebaseapp.com",
  projectId: "vimemo-63237",
  storageBucket: "vimemo-63237.appspot.com",
  messagingSenderId: "658482743555",
  appId: "1:658482743555:web:1e03f3a90b97f560db0136",
  measurementId: "G-BSTSJJB3RF"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null); // User型を明示
  const [error, setError] = useState<string | null>(null); // エラーの型を明示

  const login = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      sessionStorage.setItem('token', await result.user.getIdToken());
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Error型として扱う
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      sessionStorage.removeItem('token');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Error型として扱う
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return { user, login, logout, error };
};
