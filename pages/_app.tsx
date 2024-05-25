// pages/_app.tsx
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { FlashMessageProvider } from '../context/FlashMessageContext';
import FlashMessage from '../components/FlashMessage';
import { useRouter } from 'next/router';
import { analytics } from '../lib/initFirebase';
import { logEvent } from 'firebase/analytics';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (analytics) {
        logEvent(analytics, 'page_view', { page_path: url });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
          <div id="root">
            <Header />
            <div className="app-layout">
              <Component {...pageProps} />
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </FlashMessageProvider>
    </>
  );
};

export default MyApp;
