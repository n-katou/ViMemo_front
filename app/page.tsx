"use client";

import { Button } from '@mui/material';
import axios from 'axios';
import { useFirebaseAuth } from './hooks/useFirebaseAuth'; // Firebase Auth フックをインポート
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const Login = () => {
  const { user, logout, idToken, auth } = useFirebaseAuth(); // `auth` を追加

  // Google ログインの処理
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Googleプロバイダーをインスタンス化
    try {
      const result = await signInWithPopup(auth, provider); // ポップアップでログイン実行
      const token = await result.user.getIdToken(); // IDトークンを取得
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // バックエンドエンドポイントにリクエストを送信
      const response = await axios.post("https://vimemo.fly.dev/api/v1/users", {}, config);
      console.log('Login success:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // ログアウトの処理
  const handleLogout = async () => {
    try {
      await logout(); // ログアウト実行
    } catch (error) {
      console.error('Logout failed:', error);
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

export default Login;
