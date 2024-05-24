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
import * as gtag from '../lib/gtag';

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

  useEffect(() => {
    const logPageView = (url: string) => {
      gtag.pageview(url);
    };

    logPageView(window.location.pathname);

    nextRouter.events.on('routeChangeComplete', logPageView);

    return () => {
      nextRouter.events.off('routeChangeComplete', logPageView);
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
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <FlashMessageProvider>
        <AuthProvider>
          <div className="app-layout">
            <Header />
            <AuthenticatedApp Component={Component} pageProps={pageProps} appRouter={router} />
            <Footer />
          </div>
        </AuthProvider>
      </FlashMessageProvider>
    </>
  );
};

export default MyApp;
