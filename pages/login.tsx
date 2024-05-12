"use client";

import axios from 'axios';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // 'next/navigation' は正しくは 'next/router' を使用
import { Button, TextField, Card, Typography, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // パスが正しく、コンテキストから currentUser, setCurrentUser を取得

const LoginPage = () => {
  const router = useRouter();
  const { setCurrentUser } = useAuth(); // コンテキストから setCurrentUser 関数を取得
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://vimemo.fly.dev/api/v1/login', { email, password });
      console.log('Login successful:', response.data);
      setCurrentUser(response.data.user); // ログイン成功後、ユーザー情報を更新
      router.push('/'); // ダッシュボードへリダイレクト
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      setError(error.response?.data.error || 'ログインに失敗しました。');
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
