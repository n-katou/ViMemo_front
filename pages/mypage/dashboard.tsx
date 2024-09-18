import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserCard from '../../components/Mypage/dashboard/UserCard';
import YoutubeLikesAccordion from '../../components/Mypage/dashboard/YoutubeLikesAccordion';
import SearchForm from '../../components/Mypage/dashboard/SearchForm';
import { useDashboardData } from '../../hooks/mypage/dashboard/useDashboardData';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SortablePlaylist from '../../components/Mypage/dashboard/SortablePlaylist';

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const {
    youtubeVideoLikes,
    youtubePlaylistUrl,
    searchQuery,
    setSearchQuery,
    suggestions,
    flashMessage,
    showSnackbar,
    handleSearch,
    handleCloseSnackbar,
    shufflePlaylist,
  } = useDashboardData({ jwtToken, currentUser, setAuthState });

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">ログインして下さい。</p></div>;
  }

  const isAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8 mt-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
            <UserCard currentUser={currentUser} isAdmin={isAdmin} />
          </div>
          <div className="w-full md:flex-1 md:pl-8">
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              handleSearch={handleSearch}
            />
          </div>
        </div>
        <div className="w-full mt-8 flex">
          {/* 左側: YoutubeLikesAccordion */}
          <div className="w-2/3 pr-4">
            <YoutubeLikesAccordion
              youtubeVideoLikes={youtubeVideoLikes}
              youtubePlaylistUrl={youtubePlaylistUrl} // youtubePlaylistUrlを左側のAccordionに表示
              shufflePlaylist={shufflePlaylist} // シャッフル後に右側も更新するように修正
            />
          </div>

          {/* 右側: プレイリストタイトル表示エリア */}
          <div className="w-1/3 pl-4">
            <h2 className="text-lg font-semibold mb-4">プレイリストの動画タイトル</h2>
            <SortablePlaylist youtubeVideoLikes={youtubeVideoLikes} />
          </div>
        </div>
        {flashMessage && (
          <Snackbar
            open={showSnackbar}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {flashMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </DndProvider>
  );
};

export default Dashboard;
