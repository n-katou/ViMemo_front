import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from 'next-themes';
import LoadingSpinner from '../../components/LoadingSpinner';
import PaginationComponent from '../../components/Pagination';
import VideoCard from '../../components/Mypage/favorite_videos/FavoriteVideoCard';
import { useFavoriteVideos } from '../../hooks/mypage/favorite_videos/useFavoriteVideos';

const FavoriteVideosPage: React.FC = () => {
  const {
    currentUser,
    videos,
    loading,
    error,
    pagination,
    itemsPerPage,
    handleLikeVideo,
    handleUnlikeVideo,
    handlePageChange,
    handleItemsPerPageChange,
    moveVideo,
  } = useFavoriteVideos();

  const { theme } = useTheme(); // テーマフックを使用

  if (loading) return <LoadingSpinner loading={loading} />; // ローディング中はスピナーを表示
  if (error) return <p>Error: {error}</p>; // エラーが発生した場合はエラーメッセージを表示

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`container mx-auto py-8 px-4 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
        <h1 className="text-3xl font-bold">いいねしたYoutube一覧</h1>
        <div className="flex justify-end mb-8">
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className={`form-select ${theme === 'light' ? 'bg-white border border-gray-400 text-[#818cf8]' : 'bg-gray-800 border-gray-600 text-white'} ml-4`}>
            <option value={10}>10件表示</option>
            <option value={15}>15件表示</option>
            <option value={20}>20件表示</option>
            <option value={-1}>全件表示</option>
          </select>
        </div>
        {videos && videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  index={index}
                  video={video}
                  currentUser={currentUser}
                  handleLikeVideo={handleLikeVideo}
                  handleUnlikeVideo={handleUnlikeVideo}
                  notes={video.notes}
                  moveVideo={moveVideo}
                />
              ))}
            </div>
            <PaginationComponent
              count={pagination.total_pages}
              page={pagination.current_page}
              onChange={handlePageChange}
            />
          </>
        ) : <p>お気に入りの動画はありません。</p>}
      </div>
    </DndProvider>
  );
};

export default FavoriteVideosPage;
