import React, { useEffect, useState, useRef } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useTheme } from 'next-themes';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useYoutubeVideosPage from '../hooks/youtube_videos/useYoutubeVideosPage';
import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';
import YoutubeHeroSection from '../components/YoutubeIndex/YoutubeHeroSection';
import { useRouter } from 'next/router';
import PaginationComponent from '../components/Pagination';
import { useMediaQuery } from '@mui/material';
import { fetchRandomYoutubeVideo } from '../components/YoutubeIndex/youtubeIndexUtils';

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

  const handleWatchNow = () => {
    const currentVideo = youtubeVideos[currentVideoIndex];
    router.push(`/youtube_videos/${currentVideo.id}`);
  };

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMuted, setIsMuted] = useState(true); // デフォルトで音量OFF

  useEffect(() => {
    if (isMobile) {
      setIsMuted(true); // モバイルのみ自動ミュート
    }
  }, [currentVideoIndex, isMobile]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const scrollByBlock = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320; // カード幅（`w-80` = 20rem = 320px）
    const gap = 16;         // tailwindの `space-x-4` = 1rem = 16px
    const itemTotalWidth = cardWidth + gap;

    const currentScroll = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // 何枚目が左端にあるか（小数あり）
    const currentIndex = Math.round(currentScroll / itemTotalWidth);

    // 進める or 戻る
    const nextIndex = direction === 'left'
      ? Math.max(0, currentIndex - 3)
      : Math.min(Math.ceil(container.scrollWidth / itemTotalWidth), currentIndex + 3);

    const targetScroll = nextIndex * itemTotalWidth;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null);

  // ヒーロー動画のランダム表示（10秒ごとに変更）
  useEffect(() => {
    if (!youtubeVideos || youtubeVideos.length === 0) return;

    const getRandomVideo = async () => {
      const randomVideo = await fetchRandomYoutubeVideo();
      if (randomVideo) {
        setCurrentVideo(randomVideo);

        // モバイル時はミュートを強制ON
        if (isMobile) {
          setIsMuted(true);
        }
      }
    };

    getRandomVideo();

    const interval = setInterval(() => {
      getRandomVideo();
    }, 10000);

    return () => clearInterval(interval);
  }, [youtubeVideos, isMobile]);

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'}`}>
      {/* Heroセクション */}
      {currentVideo && (
        <YoutubeHeroSection
          video={currentVideo}
          isMuted={isMuted}
          toggleMute={toggleMute}
          onClickWatch={handleWatchNow}
        />
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
                onClick={() => scrollByBlock('left')}
                className="absolute -left-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
              >
                ◀
              </button>

              {/* 横スクロール動画一覧 */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-4 pb-4 px-10 scroll-smooth scrollbar-hide snap-x snap-mandatory"
              >
                {youtubeVideos.map((video: YoutubeVideo) => (
                  <div key={video.id} className="flex-shrink-0 w-80 snap-start">
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
                onClick={() => scrollByBlock('right')}
                className="absolute -right-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
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
