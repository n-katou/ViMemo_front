"use client";
import axios from 'axios';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';  // LoadingSpinner をインポート
import GradientButton from '../styles/GradientButton';
import { WavyBackground } from '../components/Root/WavyBackground'; // WavyBackground コンポーネントのインポート

const GoogleButton = styled(Button)({
  backgroundColor: '#4285F4',
  color: 'white',
  textTransform: 'none',
  fontSize: '16px',
  padding: '10px 24px',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#357ae8',
    transform: 'scale(1.05)', // ホバー時に拡大
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // ホバー時にシャドウを追加
  },
  '&:active': {
    transform: 'scale(0.95)', // クリック時に縮小
  },
});

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
        localStorage.setItem('loginSuccessMessage', 'ログインに成功しました');
        router.push('/mypage/dashboard');
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data.errors;
        const errorMessage = Array.isArray(errors) ? errors.join(', ') : 'ログインに失敗しました。';
        setError(errorMessage);
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
    <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
            ログイン
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <GradientButton
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              className="bg-gradient-rainbow"
              sx={{
                marginTop: '20px',
                color: '#fff'
              }}
            >
              {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'ログイン'}
            </GradientButton>
          </form>
          <div className="text-center mt-4">
            <Link href="/register" passHref>
              <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                新規登録はこちら
              </Typography>
            </Link>
          </div>
          <div className="flex justify-center mt-4">
            <GoogleButton
              variant="contained"
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
            >
              {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Googleでログイン'}
            </GoogleButton>
          </div>
          <div className="text-center mt-4">
            <Link href="/password_reset" passHref>
              <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                パスワードを忘れた方はこちら
              </Typography>
            </Link>
          </div>
        </Card>
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 画面中央上部に表示
            sx={{ marginTop: '84px', zIndex: 1400 }} // マージンを追加して位置調整
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
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 画面中央上部に表示
            sx={{ marginTop: '84px', zIndex: 1400 }} // マージンを追加して位置調整
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </WavyBackground>
  );
};

export default LoginPage;
