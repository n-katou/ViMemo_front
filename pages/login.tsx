"use client";
import axios from 'axios';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';  // LoadingSpinner をインポート

const LoginPage = () => {
  const router = useRouter();
  const { currentUser, setAuthState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ログアウト成功メッセージ用の状態

  useEffect(() => {
    if (currentUser) {
      console.log('User is logged in, redirecting to dashboard');
      const loginSuccessMessage = localStorage.getItem('loginSuccessMessage');
      if (loginSuccessMessage) {
        setSuccessMessage(loginSuccessMessage);
        localStorage.removeItem('loginSuccessMessage');
      }
      router.push('/mypage/dashboard?flash_message=ログインに成功しました');
    } else {
      const logoutMessage = localStorage.getItem('logoutMessage');
      if (logoutMessage) {
        console.log('Logout message found:', logoutMessage);
        setSuccessMessage(logoutMessage);
        localStorage.removeItem('logoutMessage');
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setAuthState({ currentUser: response.data.user, jwtToken: response.data.token });
        router.push('/mypage/dashboard');
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'ログインに失敗しました。');
        console.error('Axios error:', error.response);
      } else {
        setError('ログインに失敗しました。');
        console.error('General error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Initiating Google OAuth');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/google`, {
        headers: {
          'Frontend-Request': 'true',
        },
      });
      window.location.href = response.data.oauthUrl;
    } catch (error: any) {
      console.error('Error initiating OAuth:', error);
      setError(error.response?.data.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />;  // LoadingSpinner を使用
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          ログイン
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: '20px',
              backgroundColor: '#4CA',  // 通常ログインボタンの背景色を変更
              color: '#fff'  // 通常ログインボタンのテキスト色を変更
            }}
          >
            {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'ログイン'}
          </Button>
        </form>
        <div className="flex justify-center mt-4">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoogleLogin}
            disabled={loading}
            startIcon={
              !loading && (
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  style={{ width: 20, height: 20 }}
                />
              )
            }
            style={{
              backgroundColor: '#4285F4',
              color: 'white',
              textTransform: 'none',
              fontSize: '16px',
              padding: '10px 24px',
            }}
          >
            {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Googleでログイン'}
          </Button>
        </div>
        <div className="text-center mt-4">
          <Link href="/register">登録ページへ</Link>
        </div>
      </Card>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default LoginPage;
