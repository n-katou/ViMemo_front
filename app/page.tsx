"use client";
import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useFirebaseAuth } from './hooks/useFirebaseAuth'; // Firebase Auth フックをインポート
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthPage = () => {
  const { user, logout, idToken, auth } = useFirebaseAuth(); // `auth` を追加

  // Google ログインの処理
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Googleプロバイダーをインスタンス化
    try {
      const result = await signInWithPopup(auth, provider); // ポップアップでログイン実行
      const token = await result.user.getIdToken(); // IDトークンを取得
      const userData = {
        email: result.user.email,
        name: result.user.displayName,
        password: 'test',  // 必要な場合
        password_confirmation: 'test'  // 必要な場合
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post("https://vimemo.fly.dev/api/v1/users", { user: userData }, config);
      console.log('Login success:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // ログアウトの処理
  const handleLogout = async () => {
    if (user) {
      try {
        // Firebase からログアウト
        await logout();
        // バックエンドでトークンをクリア
        const token = await user.getIdToken();  // 現在のユーザートークンを取得
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete("https://vimemo.fly.dev/api/v1/users/logout", config);
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      console.error('No user to log out.');
    }
  };

  return (
    <div>
      {!user ? (
        <Button onClick={handleGoogleLogin} variant="contained" color="primary">
          Googleログイン
        </Button>
      ) : (
        <Button onClick={handleLogout} variant="contained" color="secondary">
          ログアウト
        </Button>
      )}
    </div>
  );
};

export default AuthPage;
