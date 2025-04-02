import React from 'react';
import { Box } from '@mui/material';
import GradientButton from '../styles/GradientButton';
import { useRouter } from 'next/router';

const LoginButton: React.FC = () => {
  const router = useRouter();
  return (
    <Box display="flex" justifyContent="center">
      <GradientButton
        onClick={() => router.push('/login')}
        variant="contained"
        sx={{
          marginTop: 2,
          backgroundColor: '#38bdf8',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#1e88e5',
          },
        }}
      >
        ログインページへ
      </GradientButton>
    </Box>
  );
};

export default LoginButton;
