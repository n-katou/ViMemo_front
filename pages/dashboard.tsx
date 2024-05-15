import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !loading) {
      // ユーザーがログインしていない場合のリダイレクト処理
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {currentUser.email}</h1>
      {/* ダッシュボードのコンテンツ */}
    </div>
  );
};

export default Dashboard;
