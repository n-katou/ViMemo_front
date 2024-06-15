import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface OAuthCallbackState {
  loading: boolean;
  isAuthenticated: boolean;
}

const useOAuthCallback = (): OAuthCallbackState => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const { code, state } = router.query;
        if (code && state) {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/callback`, {
            code,
            state,
          });
          if (response.data.status === 'success') {
            setIsAuthenticated(true);
            setTimeout(() => {
              router.push(`/mypage/dashboard?flash_message=${encodeURIComponent('ログインに成功しました')}`);
            }, 1000); // 1秒の遅延を追加してリダイレクト
          } else {
            // 認証失敗時の処理
          }
        }
      } catch (error) {
        console.error('Error during OAuth callback:', error);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [router.query]);

  return { loading, isAuthenticated };
};

export default useOAuthCallback;
