import React, { useCallback, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from '@firebase/auth';

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
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      if (result.user) {
        const token = await result.user.getIdToken();
        setIdToken(token);  // IDトークンを保存
        sessionStorage.setItem('token', token);
        console.log('ID Token:', token); // コンソールにIDトークンを出力
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIdToken(null);
      sessionStorage.removeItem('token');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, idToken, login, logout, error };
};

const AuthComponent = () => {
  const { user, idToken, login, logout, error } = useFirebaseAuth();

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      {error && <p>Error: {error}</p>}
      {user && (
        <div>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>ID Token: {idToken}</p>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
