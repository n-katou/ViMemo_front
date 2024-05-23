import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FlashMessageProvider, useFlashMessage } from '../context/FlashMessageContext';
import FlashMessage from '../components/FlashMessage';
import { Alert, Container, Box } from '@mui/material';

interface AuthenticatedAppProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
  router: AppProps['router'];
}

// ログインが必要なページかどうかを判断するためのリスト
const protectedRoutes = ['/mypage/dashboard', '/mypage/edit', '/mypage/favorites', '/mypage/my_notes']; // 例: ダッシュボードやプロフィールページなど

function AuthenticatedApp({ Component, pageProps, router }: AuthenticatedAppProps) {
  const { currentUser, loading } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  useEffect(() => {
    if (!loading && !currentUser && isProtectedRoute) {
      setFlashMessage('ログインしてください');
      setShowLoginMessage(true);
    } else {
      setShowLoginMessage(false);
    }
  }, [currentUser, loading, router.pathname, isProtectedRoute, setFlashMessage]);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  // 保護されたルートの場合、ユーザーがログインしていない場合にログインメッセージを表示する
  if (isProtectedRoute && !currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Container maxWidth="sm">
          <Alert severity="warning" variant="filled" sx={{ fontSize: '1.25rem', textAlign: 'center' }}>
            ログインが必要です
          </Alert>
        </Container>
      </Box>
    );
  }

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <FlashMessageProvider>
      <AuthProvider>
        <div className="app-layout">
          <Header />
          <FlashMessage />
          <AuthenticatedApp Component={Component} pageProps={pageProps} router={router} />
          <Footer />
        </div>
      </AuthProvider>
    </FlashMessageProvider>
  );
}
