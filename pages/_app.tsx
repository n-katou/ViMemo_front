import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { FlashMessageProvider } from '../context/FlashMessageContext';
import { useRouter } from 'next/router';
import { analytics } from '../lib/initFirebase';
import { logEvent } from 'firebase/analytics';
import { ThemeProvider } from 'next-themes'; // 修正: ThemeProvider の正しいインポートパス

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
        <meta property="og:image" content="/pinterest_board_photo_v2.png" />
        <meta property="og:url" content="https://vi-memo.com" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vi-memo.com" />
      </Head>
      <FlashMessageProvider>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div id="root" className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Component {...pageProps} />
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
