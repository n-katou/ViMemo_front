"use client";
import React, { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

const RootPage = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      ルートページ
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
