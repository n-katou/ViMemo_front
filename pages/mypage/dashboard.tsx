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
import { updatePlaylistOrder } from '../../components/Mypage/dashboard/dashboardUtils';

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const {
    youtubeVideoLikes,
    setYoutubeVideoLikes,
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

  // youtubeVideoLikes を sort_order に基づいてソート
  const sortedVideoLikes = youtubeVideoLikes
    ? [...youtubeVideoLikes].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  // プレイリストの順序を変更し、バックエンドに保存
  const handleMoveItem = async (fromIndex: number, toIndex: number) => {
    const updatedItems = [...youtubeVideoLikes];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    setYoutubeVideoLikes(updatedItems);

    const updatedOrder = updatedItems.map((item, index) => ({
      id: item.id || item.likeable_id,  // video.id または likeable_id を確認
      order: index + 1
    }));

    console.log("Updated order to send:", updatedOrder);  // 送信するデータを確認

    const videoIds = updatedOrder.map(item => item.id);
    console.log('Sending video IDs:', videoIds);  // サーバーに送信するIDを確認

    await updatePlaylistOrder(jwtToken, updatedOrder);
  };

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
              youtubeVideoLikes={sortedVideoLikes}  // ソートされたリストを渡す
              youtubePlaylistUrl={youtubePlaylistUrl}
              shufflePlaylist={shufflePlaylist}
            />
          </div>

          {/* 右側: プレイリストタイトル表示エリア */}
          <div className="w-1/3 pl-4">
            <h2 className="text-lg font-semibold mb-4">プレイリストの動画タイトル</h2>
            <SortablePlaylist youtubeVideoLikes={sortedVideoLikes} moveItem={handleMoveItem} /> {/* ドラッグ時に順序を更新 */}
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
