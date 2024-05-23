import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useOAuthCallback from '../../hooks/useOAuthCallback';
import { Box, Typography, CircularProgress } from '@mui/material';

const OAuthCallbackPage = () => {
  useOAuthCallback();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0', // 背景色を変更
        padding: 3,
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
        ログイン処理中...
      </Typography>
    </Box>
  );
};

export default OAuthCallbackPage;
