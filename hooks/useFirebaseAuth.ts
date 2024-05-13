// Assuming the correct import path for Firebase configuration and initialization
import { useState, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "../lib/initFirebase"; // Ensure this path is correct

const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle Google sign-in
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setCurrentUser(result.user);
        router.push("/"); // ログイン後のリダイレクト
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // Handle logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null); // ユーザー情報をクリア
    setLoading(false); // ローディング状態を解除
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();  // Unsubscribe on cleanup
  }, []);

  return {
    currentUser,
    setCurrentUser,
    loading,
    loginWithGoogle,
    logout,
  };
};

export default useFirebaseAuth;
