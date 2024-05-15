import { useState, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/initFirebase"; // Ensure this path is correct

const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  // Handle Google sign-in
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setCurrentUser(result.user);
        console.log("Google login successful:", result.user);  // デバッグ用ログ
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear user info
      console.log("User logged out");  // デバッグ用ログ
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false); // Ensure loading is false after logout
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);  // デバッグ用ログ
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Unsubscribe on cleanup
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
