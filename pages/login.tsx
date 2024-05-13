"use client";
import axios from 'axios';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { setCurrentUser, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://vimemo.fly.dev/api/v1/login', { email, password });
      if (response.data.success) {
        sessionStorage.setItem('token', response.data.token); // トークンをセッションストレージに保存
        setCurrentUser(response.data.user); // ユーザー情報をContextにセット
        router.push('/dashboard'); // ダッシュボードへリダイレクト
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'ログインに失敗しました。');
      } else {
        setError('ログインに失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://vimemo.fly.dev/api/v1/oauth/google', {
        headers: {
          'Frontend-Request': 'true',
        },
      });
      // OAuth URLにリダイレクトする前に、ここでstateや他の必要な情報を保存することを検討してください。
      window.location.href = response.data.oauthUrl; // OAuth URLにリダイレクト
    } catch (error: any) {
      console.error('Error initiating OAuth:', error);
      setError(error.response?.data.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card style={{ padding: '20px', maxWidth: 400, width: '100%', marginBottom: '20px' }}>
        <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          ログイン
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 px-8 pb-8">
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
            style={{ marginTop: '20px' }}
          >
            {loading ? 'ローディング...' : 'ログイン'}
          </Button>
        </form>
        <div className="flex justify-center">
          <button onClick={handleGoogleLogin} disabled={loading}>
            {loading ? 'ローディング...' : 'Googleでログイン'}
          </button>
        </div>
        <div className="text-center mt-4">
          <Link href="/register">登録ページへ</Link>
        </div>
      </Card>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default LoginPage;
