"use client";
import React, { useState } from 'react';
import { Button, Snackbar, Alert, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const RootPage = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const { currentUser, logout } = useAuth();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch('https://vimemo.fly.dev/api/v1/logout', {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       localStorage.removeItem('token');
  //       router.push('/login');
  //       setSnackbarMessage('ログアウトに成功しました！');
  //       setSnackbarSeverity('success');
  //     } else {
  //       throw new Error(data.error || 'Logout failed');
  //     }
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     setSnackbarMessage('ログアウトに失敗しました。');
  //     setSnackbarSeverity('error');
  //   } finally {
  //     setOpenSnackbar(true);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>ルートページ</Typography>
        {currentUser ? (
          <>
            <Typography variant="subtitle1">ようこそ、{currentUser.email}さん</Typography>
            <Button onClick={handleLogout} variant="outlined" color="secondary">
              ログアウト
            </Button>
          </>
        ) : (
          <Typography variant="subtitle1">ログインしてください。</Typography>
        )}
      </Grid>
    </Grid>  // 修正された Grid コンポーネントの終了タグ
  );
};

export default RootPage;
