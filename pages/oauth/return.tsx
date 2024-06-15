"use client";
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';
import useOAuthCallback from '../../hooks/useOAuthCallback';
import { WavyBackground } from '../../components/Root/WavyBackground';

const AnimatedBox = styled(Box)(({ loading }: { loading: boolean }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: loading
    ? '#f0f0f0'
    : 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)',
  backgroundSize: '200% 200%',
  animation: loading ? 'none' : 'rainbow 10s ease infinite',
  padding: 3,
  overflow: 'hidden',
  '@keyframes rainbow': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

const ReturnPage = () => {
  const { loading, isAuthenticated } = useOAuthCallback();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  const successContainerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const successTextVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  const successIconVariants = {
    hidden: { opacity: 0, rotate: -90 },
    visible: { opacity: 1, rotate: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  return (
    <AnimatedBox loading={loading}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <WavyBackground />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          padding: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            padding: 4,
            textAlign: 'center',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="loading"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <motion.div variants={textVariants}>
                  <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: '#000' }}>
                    ログイン処理中...
                  </Typography>
                </motion.div>
              </motion.div>
            ) : (
              isAuthenticated && (
                <motion.div
                  key="authenticated"
                  variants={successContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <motion.div
                    variants={successIconVariants}
                    style={{
                      fontSize: '4rem',
                      color: '#4caf50',
                    }}
                  >
                    ✅
                  </motion.div>
                  <motion.div variants={successTextVariants}>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: '#000', mt: 2 }}>
                      認証成功！リダイレクト中...
                    </Typography>
                  </motion.div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </AnimatedBox>
  );
};

export default ReturnPage;
