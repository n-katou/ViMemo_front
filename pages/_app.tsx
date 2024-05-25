import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FlashMessageProvider, useFlashMessage } from '../context/FlashMessageContext';
import FlashMessage from '../components/FlashMessage';
import { Alert, Container, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { analytics } from '../lib/initFirebase';
import { logEvent } from 'firebase/analytics';

interface AuthenticatedAppProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
  appRouter: AppProps['router'];
}

const protectedRoutes = ['/mypage/dashboard', '/mypage/edit', '/mypage/favorites', '/mypage/my_notes'];

function AuthenticatedApp({ Component, pageProps, appRouter }: AuthenticatedAppProps) {
  const { currentUser, loading } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const isProtectedRoute = protectedRoutes.includes(appRouter.pathname);

  useEffect(() => {
    if (!loading && !currentUser && isProtectedRoute) {
      setFlashMessage('ログインしてください', 'warning');
      setShowLoginMessage(true);
    } else {
      setShowLoginMessage(false);
    }
  }, [currentUser, loading, appRouter.pathname, isProtectedRoute, setFlashMessage]);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

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

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const nextRouter = useRouter();
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (analytics) {
        logEvent(analytics, 'page_view', { page_path: url });
      }
      setShowFooter(url !== '/'); // ルートページ以外ではFooterを表示する
    };

    nextRouter.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      nextRouter.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [nextRouter.events]);

  return (
    <>
      <Head>
        <title>Vimemo</title>
        <meta name="description" content="ViMemoは、動画視聴中に直感的にメモを追加できるサービスです。" />
        <meta property="og:title" content="ViMemo" />
        <meta property="og:description" content="動画視聴中、直感的にメモを追加できるサービス" />
        <meta property="og:image" content="https://vimemo.s3.ap-northeast-1.amazonaws.com/uploads/pinterest_board_photo.png" />
        <meta property="og:url" content="https://vimemo.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://vimemo.vercel.app" />
      </Head>
      <FlashMessageProvider>
        <AuthProvider>
          <Box id="root" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexShrink: 0 }}>
              <Header />
            </Box>
            <Box component="main" sx={{ flex: 1, backgroundColor: 'black', color: 'white' }}>
              <AuthenticatedApp Component={Component} pageProps={pageProps} appRouter={router} />
            </Box>
            {showFooter && (
              <Box sx={{ flexShrink: 0 }}>
                <Footer />
              </Box>
            )}
          </Box>
        </AuthProvider>
      </FlashMessageProvider>
    </>
  );
};

export default MyApp;
