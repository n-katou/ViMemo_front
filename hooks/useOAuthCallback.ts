import { useEffect } from 'react';
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
      fetchAndSetCurrentUser(token as string);
    } else {
      console.error('OAuth callback error: No token received');
      router.push('/login');
    }
  }, [router]);

  const fetchAndSetCurrentUser = async (token: string) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setCurrentUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    }
  };
};

export default useOAuthCallback;
