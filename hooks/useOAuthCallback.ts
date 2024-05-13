import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const useOAuthCallback = () => {
  const router = useRouter();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('session_id');

    if (token) {
      localStorage.setItem('token', token);

      // バックエンドからユーザーデータをフェッチ
      fetchUserData(token).then(userData => {
        setCurrentUser(userData); // 取得したユーザーデータをセット
        router.push('/dashboard'); // ダッシュボードへリダイレクト
      }).catch(error => {
        console.error(error);
        router.push('/login'); // エラーがあればログインページへリダイレクト
      });
    } else {
      router.push('/login');
    }
  }, [router, setCurrentUser]);
};

async function fetchUserData(token: string) {
  // ユーザー固有のIDを含めずにリクエスト
  const response = await fetch('https://vimemo.fly.dev/api/v1/users', {  // IDを除外し、'user'エンドポイントに変更
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }

  return await response.json();
}

export default useOAuthCallback;
