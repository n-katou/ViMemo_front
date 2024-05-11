"use client";
import axios from "axios";

import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const AuthPage = () => {
  const { loginWithGoogle } = useFirebaseAuth();

  const handleGoogleLogin = () => {
    const verifyIdToken = async () => {
      const user = await loginWithGoogle();
      const token = await user?.getIdToken();

      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      try {
        axios.post("https://vimemo.fly.dev/api/v1/users", null, config);
      } catch (err) {
        let message;
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response.data.message);
        } else {
          message = String(err);
          console.error(message);
        }
      }
    };
    verifyIdToken();
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

export default AuthPage;
