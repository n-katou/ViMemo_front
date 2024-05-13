import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useOAuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    // URLからトークンを取得
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('session_id');

    if (token) {
      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      // ダッシュボードへリダイレクト
      router.push('/dashboard');
    } else {
      // トークンがなければログインページへリダイレクト
      router.push('/login');
    }
  }, [router]);
};

export default useOAuthCallback;
