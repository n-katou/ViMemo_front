import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useTheme } from 'next-themes';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PaginationComponent from '../components/Pagination';
import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';
import useYoutubeVideosPage from '../hooks/youtube_videos/useYoutubeVideosPage';

import ReactPlayer from 'react-player';

const YoutubeVideosPage: React.FC = () => {
  const {
    youtubeVideos,
    notes,
    loading,
    error,
    pagination,
    sortOption,
    flashMessage,
    showSnackbar,
    jwtToken,
    setNotes,
    handleSortChange,
    handlePageChange,
    handleTitleClick,
    handleLikeVideoWrapper,
    handleUnlikeVideoWrapper,
    handleCloseSnackbar,
  } = useYoutubeVideosPage();

  const { theme } = useTheme();

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // ランダムに10秒ごとに切り替え
  useEffect(() => {
    if (youtubeVideos.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * youtubeVideos.length);
      setCurrentVideoIndex(randomIndex);
    }, 20000); // 20秒

    return () => clearInterval(interval);
  }, [youtubeVideos]);

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`container mx-auto py-8 px-4 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <h1 className="text-3xl font-bold">Youtube一覧</h1>
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className={`form-select form-select-lg ${theme === 'light' ? 'text-[#818cf8] bg-white border border-gray-600' : 'text-white bg-gray-800'}`}
        >
          <option value="created_at_desc">デフォルト（取得順）</option>
          <option value="published_at_desc">公開日順</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
      {youtubeVideos.length > 0 ? (
        <>
          <div className="mb-8">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${youtubeVideos[currentVideoIndex].youtube_id}`}
              playing
              muted
              controls
              width="100%"
              height="480px"
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video: YoutubeVideo) => (
              <YoutubeVideoCard
                key={video.id}
                video={video}
                handleTitleClick={handleTitleClick}
                handleLikeVideo={handleLikeVideoWrapper}
                handleUnlikeVideo={handleUnlikeVideoWrapper}
                notes={notes.filter(note => note.youtube_video_id === video.id)}
                jwtToken={jwtToken}
                setNotes={setNotes}
              />
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
          />
        </>
      ) : (
        <p>動画がありません。</p>
      )}
      {
        flashMessage && (
          <Snackbar
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {flashMessage}
            </Alert>
          </Snackbar>
        )
      }
    </div >
  );
};

export default YoutubeVideosPage;
