import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useOAuthCallback = () => {
  const router = useRouter();
  const { setAuthState } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('session_id');

      console.log("Token from URL:", token); // デバッグ用のログ

      if (token) {
        localStorage.setItem('token', token);

        try {
          const userData = await fetchUserData(token, signal);
          if (!signal.aborted) {
            setAuthState({ currentUser: userData, jwtToken: token });
            await router.push('/mypage/dashboard'); // ダッシュボードへリダイレクト
          }
        } catch (error) {
          if (!signal.aborted) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              console.error("Unauthorized error: ", error.response.data);
            } else {
              console.error("Error fetching user data:", error);
            }
            router.push('/login'); // エラーがあればログインページへリダイレクト
          } else {
            console.log("Fetch user data request was canceled");
          }
        }
      } else {
        router.push('/login');
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [router, setAuthState]);
};

async function fetchUserData(token: string, signal: AbortSignal) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: signal // リクエストにsignalを渡す
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Fetch user data canceled");
    } else {
      console.error("Axios error:", error); // デバッグ用のログ
      throw error;
    }
  }
}

export default useOAuthCallback;
