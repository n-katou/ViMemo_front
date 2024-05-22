import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useOAuthCallback = () => {
  const router = useRouter();
  const { setAuthState } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('session_id');

    console.log("Token from URL:", token); // デバッグ用のログ

    if (token) {
      localStorage.setItem('token', token);

      // バックエンドからユーザーデータをフェッチ
      fetchUserData(token)
        .then(userData => {
          setAuthState({ currentUser: userData, jwtToken: token });
          router.push('/mypage/dashboard'); // ダッシュボードへリダイレクト
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          router.push('/login'); // エラーがあればログインページへリダイレクト
        });
    } else {
      router.push('/login');
    }
  }, [router, setAuthState]);
};

async function fetchUserData(token: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Fetch user data failed:", error); // デバッグ用のログ
    throw error;
  }
}

export default useOAuthCallback;
