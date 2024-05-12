"use client";
import axios, { AxiosError } from 'axios';
import { Button, TextField, Card, Typography, Snackbar, Alert } from '@mui/material';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const { currentUser, logout, loginWithGoogle } = useFirebaseAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
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
      const response = await axios.post("https://vimemo.fly.dev/api/v1/users", userData, config);
      console.log('Registration successful', response.data);
      router.push('/?registered=true');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || '登録に失敗しました。');
      } else {
        setError('登録に失敗しました。');
      }
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const user = await loginWithGoogle();
  //     if (user) {
  //       const token = await user.getIdToken();
  //       const userData = {
  //         user: {
  //           name: user.displayName,
  //           email: user.email,
  //           password: 'test',
  //           password_confirmation: 'test'
  //         }
  //       };
  //       const config = {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         }
  //       };
  //       await axios.post("https://vimemo.fly.dev/api/v1/users/auth_create", userData, config);
  //       console.log('User registered successfully');
  //     }
  //   } catch (error) {
  //     setError('Google アカウントでの登録に失敗しました。');
  //   }
  // };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <Card style={{ padding: '20px', maxWidth: 400, width: '100%', marginBottom: '20px' }}>
        <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '20px' }}>
          ユーザー登録
        </Typography>
        <TextField label="名前" variant="outlined" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
        <TextField label="メールアドレス" variant="outlined" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="パスワード" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <TextField label="パスワード確認" variant="outlined" type="password" fullWidth margin="normal" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
        <Button onClick={handleRegister} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          登録
        </Button>
      </Card>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      {/* <Button onClick={handleGoogleLogin} variant="contained" color="primary">
        Googleで登録
      </Button> */}
    </div>
  );
}

export default RegisterPage;
