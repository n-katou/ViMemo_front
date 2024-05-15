import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div>
      Welcome, {currentUser.email}!
    </div>
  );
};

export default Dashboard;
