"use client";
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion のインポート

import { Box } from '@mui/material';

import { useAuth } from '../context/AuthContext';

import LoadingSpinner from '../components/LoadingSpinner';  // LoadingSpinner をインポート
import { WavyBackground } from '../components/Root/WavyBackground'; // WavyBackground コンポーネントのインポート
import LoginForm from '../components/Login/LoginForm';

const LoginPage = () => {
  const router = useRouter();
  const { currentUser, setAuthState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ログアウト成功メッセージ用の状態
  const [animateOut, setAnimateOut] = useState(false); // アニメーション用の状態

  useEffect(() => {
    if (currentUser) {
      console.log('User is logged in, redirecting to dashboard');
      const loginSuccessMessage = localStorage.getItem('loginSuccessMessage');
      if (loginSuccessMessage) {
        setSuccessMessage(loginSuccessMessage);
        localStorage.removeItem('loginSuccessMessage');
      }
      // 遷移をアニメーションで遅らせる
      setAnimateOut(true);
      setTimeout(() => {
        router.push('/mypage/dashboard?flash_message=ログインに成功しました');
      }, 800); // アニメーションの時間と合わせる
    } else {
      const logoutMessage = localStorage.getItem('logoutMessage');
      if (logoutMessage) {
        console.log('Logout message found:', logoutMessage);
        setSuccessMessage(logoutMessage);
        localStorage.removeItem('logoutMessage');
      }
    }
  }, [currentUser, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setAuthState({ currentUser: response.data.user, jwtToken: response.data.token });
        localStorage.setItem('loginSuccessMessage', 'ログインに成功しました');
        // アニメーションを表示
        setAnimateOut(true);
        setTimeout(() => {
          router.push('/mypage/dashboard');
        }, 800); // アニメーションの時間と合わせる
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data.errors;
        const errorMessage = Array.isArray(errors) ? errors.join(', ') : 'ログインに失敗しました。';
        setError(errorMessage);
        console.error('Axios error:', error.response);
      } else {
        setError('ログインに失敗しました。');
        console.error('General error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Initiating Google OAuth');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/google`, {
        headers: {
          'Frontend-Request': 'true',
        },
      });
      // ローディングアニメーションを表示
      setAnimateOut(true);
      setTimeout(() => {
        window.location.href = response.data.oauthUrl;
      }, 800); // アニメーションの時間と合わせる
    } catch (error: any) {
      console.error('Error initiating OAuth:', error);
      setError(error.response?.data.error || error.message);
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />;  // LoadingSpinner を使用
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate={animateOut ? "out" : "initial"}
        variants={pageVariants}
        transition={pageTransition}
      >
        <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              error={error}
              successMessage={successMessage}
              handleSubmit={handleSubmit}
              handleGoogleLogin={handleGoogleLogin}
              setError={setError}
              setSuccessMessage={setSuccessMessage}
            />
          </Box>
        </WavyBackground>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPage;
