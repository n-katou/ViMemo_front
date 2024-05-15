// pages/_app.tsx
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";

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
    return <div>Loading...</div>;
  }

  return <Component {...pageProps} />;
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className="app-layout">
      <AuthProvider>
        <Header />
        <AuthenticatedApp Component={Component} pageProps={pageProps} router={router} />
      </AuthProvider>
    </div>
  );
}
