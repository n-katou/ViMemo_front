"use client";

import { useCallback, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from '@firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signInWithCredential,
  signOut,
  Auth,
} from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1nZ7W6TxTCKcqkogtpRS5q_TJDsxcBmY",
  authDomain: "runteq-417906.firebaseapp.com",
  projectId: "runteq-417906",
  storageBucket: "runteq-417906.appspot.com",
  messagingSenderId: "976355655065",
  appId: "1:976355655065:web:82b9e08c717939f404e708",
  measurementId: "G-K8S07YXGZ5"
};

// Firebaseアプリの初期化（すでに存在する場合はそれを使用）
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const useAuth = (auth: Auth) => {
  const [state, setState] = useState<'idel' | 'progress' | 'logined' | 'logouted' | 'error'>('idel');
  const [error, setError] = useState<unknown>('');
  const [credential, setCredential] = useState<UserCredential>();

  const dispatch = useCallback(
    (action: { type: 'login'; payload?: { token: string } } | { type: 'logout' }) => {
      setError('');
      switch (action.type) {
        case 'login':
          setState('progress');
          if (action.payload?.token) {
            signInWithCredential(auth, GoogleAuthProvider.credential(action.payload.token))
              .then((result) => {
                setCredential(result);
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          } else {
            signInWithPopup(auth, provider)
              .then((result) => {
                setCredential(result);
                setState('logined');
              })
              .catch((e) => {
                setError(e);
                setState('error');
              });
          }
          break;
        case 'logout':
          setState('progress');
          signOut(auth)
            .then(() => {
              setCredential(undefined);
              setState('logouted');
            })
            .catch((e) => {
              setError(e);
              setState('error');
            });
          break;
      }
    },
    [auth]
  );

  return { state, error, credential, dispatch };
};

const Page = () => {
  const { state, dispatch, credential, error } = useAuth(auth);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch({ type: 'login', payload: { token } });
    }
  }, [dispatch]);

  useEffect(() => {
    if (credential) {
      const token = GoogleAuthProvider.credentialFromResult(credential)?.idToken;
      token && sessionStorage.setItem('token', token);
      sendTokenToBackend(token);  // バックエンドにトークンを送信
    } else {
      sessionStorage.removeItem('token');
    }
  }, [credential]);

  const handleLogin = () => dispatch({ type: 'login' });
  const handleLogout = () => dispatch({ type: 'logout' });

  return (
    <div>
      <button onClick={handleLogin}>ログイン</button>
      <button onClick={handleLogout}>ログアウト</button>
      <div>User: {credential?.user.displayName}</div>
      <div>State: {state}</div>
      <div>Error: {String(error)}</div>
    </div>
  );
  async function sendTokenToBackend(token: string | undefined) {
    if (!token) {
      console.error("No token provided for backend authentication.");
      return;
    }

    try {
      const response = await fetch('https://vimemo.fly.dev/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Auth response:', data);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }
};
export default Page;

