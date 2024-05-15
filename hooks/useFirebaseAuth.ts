import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { auth } from '../lib/initFirebase';
import axios from 'axios';
import { AuthState } from "../types/AuthState";

const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ currentUser: null, jwtToken: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/firebase`, { token });
          setAuthState({ currentUser: user, jwtToken: response.data.jwtToken });
        } catch (error) {
          console.error('Error fetching JWT token from backend:', error);
        }
      } else {
        setAuthState({ currentUser: null, jwtToken: null });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setAuthState({ currentUser: null, jwtToken: null });
  };

  return {
    ...authState,
    loading,
    loginWithGoogle,
    logout,
    setAuthState, // setAuthStateを返す
  };
};

export default useFirebaseAuth;
