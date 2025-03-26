import React, { useEffect, useState, useRef } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useTheme } from 'next-themes';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useYoutubeVideosPage from '../hooks/youtube_videos/useYoutubeVideosPage';
import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';
import GradientButton from '../styles/GradientButton';
import { motion, AnimatePresence } from 'framer-motion';
import PaginationComponent from '../components/Pagination';
import IconButton from '@mui/material/IconButton';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

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
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = (direction: 'left' | 'right', speed = 150) => {
    if (scrollIntervalRef.current) return;

    scrollIntervalRef.current = setInterval(() => {
      scrollContainerRef.current?.scrollBy({
        left: direction === 'left' ? -speed : speed,
        behavior: 'smooth',
      });
    }, 16); // 約60fps
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const scrollFastOnce = (direction: 'left' | 'right') => {
    stopAutoScroll();

    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    let targetScroll = direction === 'left'
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(maxScrollLeft, currentScroll + scrollAmount);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };


  const handleWatchNow = () => {
    const currentVideo = youtubeVideos[currentVideoIndex];
    router.push(`/youtube_videos/${currentVideo.id}`);
  };

  // ヒーロー動画を定期的に変更
  useEffect(() => {
    if (youtubeVideos.length === 0) return;

    const safeIndex = Math.floor(Math.random() * youtubeVideos.length);
    setCurrentVideoIndex(safeIndex);

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * youtubeVideos.length);
      setCurrentVideoIndex(newIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, [youtubeVideos]);

  const [isMuted, setIsMuted] = useState(true); // デフォルトで音量OFF

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'}`}>
      {/* Heroセクション */}
      {youtubeVideos.length > 0 && youtubeVideos[currentVideoIndex] && (
        <div className="relative w-full h-[60vh] mb-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={youtubeVideos[currentVideoIndex].id}
              initial={{ opacity: 0, scale: 1.05, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {/* 動画 */}
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${youtubeVideos[currentVideoIndex].youtube_id}`}
                playing
                muted={isMuted}
                controls={false}
                volume={isMuted ? 0 : 1}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
              />

              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

              {/* タイトルとボタン */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-10 left-10 z-20 text-white"
              >
                <h2 className="text-4xl font-bold mb-4 max-w-2xl drop-shadow-xl">
                  {youtubeVideos[currentVideoIndex].title}
                </h2>
                <GradientButton
                  onClick={handleWatchNow}
                  variant="contained"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  今すぐ見る
                </GradientButton>
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 48,
                    height: 48,
                    border: '2px solid white',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    zIndex: 30,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 検索結果が0件の場合の表示 */}
      {youtubeVideos.length === 0 ? (
        <div className="text-center py-20 text-lg text-gray-500">
          該当する動画はありません。
        </div>
      ) : (
        <>
          {/* ソートオプション */}
          <div className="container mx-auto px-4 mb-6">
            <div className="flex justify-end">
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`p-2 rounded border ${theme === 'light' ? 'bg-white border-gray-600 text-gray-800' : 'bg-gray-800 border-gray-600 text-white'}`}
              >
                <option value="created_at_desc">デフォルト（取得順）</option>
                <option value="published_at_desc">公開日順</option>
                <option value="likes_desc">いいね数順</option>
                <option value="notes_desc">メモ数順</option>
              </select>
            </div>
          </div>

          {/* 横スクロールセクション */}
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-4">おすすめ動画</h3>

            <div className="relative">
              {/* 左ボタン */}
              <button
                onMouseEnter={() => startAutoScroll('left', 80)}  // ゆっくりホバー
                onMouseLeave={stopAutoScroll}
                onClick={() => scrollFastOnce('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
                style={{ transform: 'translateY(-50%)' }}
              >
                ◀
              </button>

              {/* 横スクロール動画一覧 */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-4 pb-4 px-10 scroll-smooth scrollbar-hide"
              >
                {youtubeVideos.map((video: YoutubeVideo) => (
                  <div key={video.id} className="flex-shrink-0 w-80">
                    <YoutubeVideoCard
                      video={video}
                      handleTitleClick={handleTitleClick}
                      handleLikeVideo={handleLikeVideoWrapper}
                      handleUnlikeVideo={handleUnlikeVideoWrapper}
                      notes={notes.filter(note => note.youtube_video_id === video.id)}
                      jwtToken={jwtToken}
                      setNotes={setNotes}
                    />
                  </div>
                ))}
              </div>

              {/* 右ボタン */}
              <button
                onMouseEnter={() => startAutoScroll('right', 80)} // ゆっくりホバー
                onMouseLeave={stopAutoScroll}
                onClick={() => scrollFastOnce('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
                style={{ transform: 'translateY(-50%)' }}
              >
                ▶
              </button>
            </div>
            <div className="mt-6 mb-3 flex justify-center">
              <PaginationComponent
                count={pagination.total_pages}
                page={pagination.current_page}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </>
      )}

      {/* スナックバー */}
      {flashMessage && (
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
      )}
    </div>
  );
};

export default YoutubeVideosPage;
