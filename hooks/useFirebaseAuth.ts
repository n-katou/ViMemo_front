import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { auth } from '../lib/initFirebase';
import axios from 'axios';
import { AuthState } from '../types/AuthState';
import { CustomUser } from '../types/user';

const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ currentUser: null, jwtToken: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          setAuthState({ currentUser: response.data, jwtToken: token });
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setAuthState({ currentUser: null, jwtToken: null });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    localStorage.setItem('token', token);

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/firebase`, { token });

    const customUser: CustomUser = {
      ...result.user,
      id: result.user.uid,
      name: result.user.displayName || "",
      email: result.user.email || "",
      avatar: {
        url: result.user.photoURL || "",
      },
    };

    setAuthState({ currentUser: customUser, jwtToken: response.data.jwtToken});
  };

  const logout = async () => {
    await signOut(auth);
    setAuthState({ currentUser: null, jwtToken: null });
    localStorage.removeItem('token');
  };

  return {
    ...authState,
    loading,
    loginWithGoogle,
    logout,
    setAuthState,
  };
};

export default useFirebaseAuth;
