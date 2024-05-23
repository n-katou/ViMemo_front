import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FlashMessageProvider } from '../context/FlashMessageContext';
import FlashMessage from '../components/FlashMessage';

interface AuthenticatedAppProps {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
  router: AppProps['router'];
}

// ログインが必要なページかどうかを判断するためのリスト
const protectedRoutes = ['/mypage/dashboard', '/mypage/edit', '/mypage/favorites', '/mypage/notes']; // 例: ダッシュボードやプロフィールページなど

function AuthenticatedApp({ Component, pageProps, router }: AuthenticatedAppProps) {
  const { currentUser, loading } = useAuth();

  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  useEffect(() => {
    if (!loading && !currentUser && isProtectedRoute) {
      router.push('/login');
    }
  }, [currentUser, loading, router, isProtectedRoute]);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  // 保護されたルートの場合、ユーザーがログインしていない場合にログインページにリダイレクトする
  if (isProtectedRoute && !currentUser) {
    return null;
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
