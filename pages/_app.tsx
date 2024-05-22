// pages/_app.tsx
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner'; // LoadingSpinner をインポート
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FlashMessageProvider } from '../context/FlashMessageContext';
import FlashMessage from '../components/FlashMessage';

interface AuthenticatedAppProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
  router: AppProps['router'];
}

function AuthenticatedApp({ Component, pageProps, router }: AuthenticatedAppProps) {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className="app-layout">
      <AuthProvider>
        <Header />
        <FlashMessageProvider>
          <FlashMessage />
          <AuthenticatedApp Component={Component} pageProps={pageProps} router={router} />
        </FlashMessageProvider>
        <Footer />
      </AuthProvider>
    </div>
  );
}
