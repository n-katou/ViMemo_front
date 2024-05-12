"use client";
import axios from "axios";
import { Button } from '@mui/material';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const LoginPage = () => {
  const { currentUser, logout, loginWithGoogle } = useFirebaseAuth();

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        const token = await user.getIdToken();
        const userData = {
          user: {
            name: user.displayName, // Firebaseから提供されるdisplayName
            email: user.email, // Firebaseから提供されるemail
            password: 'test',
            password_confirmation: 'test'
          }
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.post("https://vimemo.fly.dev/api/v1/users", userData, config);
        console.log('User registered successfully');
      }
    } catch (err) {
      let message = "An error occurred during the login process.";
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error:', err.response.data);
      } else {
        console.error(message);
      }
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      try {
        // Firebase からログアウト
        await logout();
        // バックエンドでトークンをクリア
        const token = await currentUser.getIdToken();  // 現在のユーザートークンを取得
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
      {!currentUser ? (
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
}

export default LoginPage;
