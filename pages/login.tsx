"use client";

import axios from 'axios';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // 正しいパスに修正

const LoginPage = () => {
  const router = useRouter();
  const { updateAuthState } = useAuth(); // 認証状態を更新する関数をコンテキストから取得
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://vimemo.fly.dev/api/v1/login', { email, password });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // 仮にトークンがレスポンスに含まれる場合
      updateAuthState(response.data.user); // 認証状態を更新
      router.push('/'); // ユーザーをダッシュボードにリダイレクト
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      setError(error.response?.data.error || 'ログインに失敗しました。');
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
      // OAuthフロー完了後にフロントエンドのルートに自動でリダイレクトされるようにする場合、
      // バックエンドでのリダイレクト先URLを調整する必要があります。
      // ここではバックエンドからのリダイレクトを想定し、router.push('/')をコメントアウトしています。
      // router.push('/');
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
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
