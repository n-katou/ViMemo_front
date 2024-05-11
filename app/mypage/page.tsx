"use client";
import React from 'react';
import { Button } from '@mui/material';
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import axios from "axios";

const LoginPage = () => {
  const { currentUser, logout, loginWithGoogle } = useFirebaseAuth();

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        const token = await user.getIdToken();
        const config = {
          headers: { authorization: `Bearer ${token}` },
        };
        await axios.post("https://vimemo.fly.dev/api/v1/users", null, config);
      }
    } catch (err) {
      let message = "An error occurred during the login process.";
      if (axios.isAxiosError(err) && err.response) {
        console.error(err.response.data.message);
      } else {
        console.error(message);
      }
    }
  };

  return (
    <div>
      {!currentUser ? (
        <Button onClick={handleGoogleLogin} variant="contained" color="primary">
          Googleログイン
        </Button>
      ) : (
        <Button onClick={logout} variant="contained" color="secondary">
          ログアウト
        </Button>
      )}
    </div>
  );
};

export default LoginPage;
