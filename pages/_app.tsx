import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FlashMessageProvider, useFlashMessage } from '../context/FlashMessageContext';
import { useRouter } from 'next/router';
import { Alert, Container, Box, Button } from '@mui/material';
import { analytics } from '../lib/initFirebase';
import { logEvent } from 'firebase/analytics';
import { ThemeProvider } from 'next-themes';

import GradientButton from '../styles/GradientButton';

interface AuthenticatedAppProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
  appRouter: AppProps['router'];
}

const protectedRoutes = ['/mypage/dashboard', '/mypage/edit', '/mypage/favorite_videos', '/mypage/favorite_notes', '/mypage/my_notes'];

function AuthenticatedApp({ Component, pageProps, appRouter }: AuthenticatedAppProps) {
  const { currentUser, loading } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const router = useRouter();

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
          <Box sx={{ mt: 2 }}>
            <GradientButton variant="contained" sx={{ fontSize: '1.25rem', textAlign: 'center' }} onClick={() => router.push('/login')}>
              ログインページへ
            </GradientButton>
          </Box>
        </Container>
      </Box>
    );
  }

  return <Component {...pageProps} />;
}

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const nextRouter = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (analytics) {
        logEvent(analytics, 'page_view', { page_path: url });
      }
    };

    nextRouter.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      nextRouter.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [nextRouter.events]);

  return (
    <>
      <Head>
        <title>ViMemo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="ViMemoは、動画視聴中に直感的にメモを追加できるサービスです。" />
        <meta property="og:title" content="ViMemo" />
        <meta property="og:description" content="動画視聴中、直感的にメモを追加できるサービス" />
        <meta property="og:image" content="https://vimemo.s3.ap-northeast-1.amazonaws.com/uploads/pinterest_board_photo.png" />
        <meta property="og:url" content="https://vi-memo.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://vimemo.s3.ap-northeast-1.amazonaws.com/uploads/pinterest_board_photo.png" />
        <link rel="canonical" href="https://vi-memo.com" />
      </Head>
      <FlashMessageProvider>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div id="root" className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <AuthenticatedApp Component={Component} pageProps={pageProps} appRouter={router} />
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </FlashMessageProvider>
    </>
  );
};

export default MyApp;
