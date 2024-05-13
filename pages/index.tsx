"use client";
import React, { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';  // 仮定しているフックのインポート

const RootPage = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { currentUser, logout } = useAuth();  // ログイン状態とログアウト関数を取得

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      ルートページ
      {currentUser && (
        <Button onClick={handleLogout} variant="outlined" color="secondary">
          ログアウト
        </Button>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          登録が成功しました！
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RootPage;
