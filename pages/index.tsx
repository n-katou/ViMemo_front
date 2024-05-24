"use client";
import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const RootPage = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const logoutMessage = localStorage.getItem('logoutMessage');
    if (logoutMessage) {
      setSnackbarMessage(logoutMessage);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      localStorage.removeItem('logoutMessage');
    }
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSnackbarMessage('ログアウトに成功しました。');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setSnackbarMessage('ログアウトに失敗しました。');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
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
          <>
            <Typography variant="subtitle1">ログインしてください。</Typography>
            <Button onClick={() => router.push('/login')} variant="outlined" color="primary">
              ログインページへ
            </Button>
          </>
        )}
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default RootPage;
