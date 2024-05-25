"use client";
import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Card, Typography, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const router = useRouter();
  const { setAuthState, currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push('/mypage/dashboard');
    }
  }, [currentUser, router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = {
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }
      };
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const registerResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, userData, config);
      console.log('Registration successful', registerResponse.data);

      // ユーザー登録後にログインを試みる
      const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, { email, password });
      if (loginResponse.data.success) {
        localStorage.setItem('token', loginResponse.data.token);
        setAuthState({ currentUser: loginResponse.data.user, jwtToken: loginResponse.data.token });
        // フラッシュメッセージをlocalStorageに保存
        localStorage.setItem('flashMessage', '登録が成功しました');
        router.push('/mypage/dashboard?flash_message=登録に成功しました');
      } else {
        setError(loginResponse.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || '登録に失敗しました。');
      } else {
        setError('登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Card style={{ padding: '20px', maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          ユーザー登録
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField label="名前" variant="outlined" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="メールアドレス" variant="outlined" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="パスワード" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          <TextField label="パスワード確認" variant="outlined" type="password" fullWidth margin="normal" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }} disabled={loading}>
            {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : '登録'}
          </Button>
        </form>
      </Card>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RegisterPage;
