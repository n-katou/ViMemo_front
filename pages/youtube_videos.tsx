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
import HorizontalVideoShelf from '../components/YoutubeIndex/HorizontalVideoShelf';
import useYoutubeVideoRankings from '../components/YoutubeIndex/useYoutubeVideoRankings';
import { handleLikeVideo, handleUnlikeVideo } from '../components/YoutubeIndex/youtubeIndexUtils';
import { useAuth } from '../context/AuthContext';

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

  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMuted, setIsMuted] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    topLikedVideos,
    topNotedVideos,
    topRecentVideos,
    loading: rankingLoading,
    setTopLikedVideos,
    setTopNotedVideos,
    setTopRecentVideos,
  } = useYoutubeVideoRankings();

  useEffect(() => {
    if (isMobile) setIsMuted(true);
  }, [currentVideoIndex, isMobile]);

  const toggleMute = () => setIsMuted(prev => !prev);

  const scrollByBlock = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    const container = ref.current;
    if (!container) return;

    const cardWidth = 320;
    const gap = 16;
    const itemTotalWidth = cardWidth + gap;

    const scrollStep = isMobile ? 1 : 3;

    const currentScroll = container.scrollLeft;
    const currentIndex = Math.round(currentScroll / itemTotalWidth);
    const nextIndex = direction === 'left'
      ? Math.max(0, currentIndex - scrollStep)
      : Math.min(Math.ceil(container.scrollWidth / itemTotalWidth), currentIndex + scrollStep);

    container.scrollTo({
      left: nextIndex * itemTotalWidth,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!youtubeVideos || youtubeVideos.length === 0) return;

    const getRandomVideo = async () => {
      const randomVideo = await fetchRandomYoutubeVideo();
      if (randomVideo) {
        setCurrentVideo(randomVideo);
        if (isMobile) setIsMuted(true);
      }
    };

    getRandomVideo();
    const interval = setInterval(getRandomVideo, 12000);
    return () => clearInterval(interval);
  }, [youtubeVideos, isMobile]);

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'}`}>
      {currentVideo && (
        <YoutubeHeroSection
          video={currentVideo}
          isMuted={isMuted}
          toggleMute={toggleMute}
          onClickWatch={() => router.push(`/youtube_videos/${currentVideo.id}`)}
        />
      )}
      {youtubeVideos.length === 0 ? (
        <div className="text-center py-20 text-lg text-gray-500">
          該当する動画はありません。
        </div>
      ) : (
        <div className="w-full px-4 mb-12 relative z-0">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text flex items-center gap-2">絞り込み・検索結果</h3>
          <div className="flex justify-end mb-4">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`p-2 rounded border ${theme === 'light' ? 'bg-white border-gray-600 text-gray-800' : 'bg-gray-800 border-gray-600 text-white'}`}
            >
              <option value="created_at_desc">取得順</option>
              <option value="published_at_desc">公開日順</option>
              <option value="likes_desc">いいね数順</option>
              <option value="notes_desc">メモ数順</option>
            </select>
          </div>
          <div className="relative w-full pb-4 overflow-visible">
            <button
              onClick={() => scrollByBlock('left', scrollContainerRef)}
              className="absolute z-50 -left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
            >
              ◀
            </button>
            <div className="relative w-full pb-4 overflow-visible z-10">
              <div className="mx-8 overflow-visible">
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide snap-x snap-mandatory overflow-visible relative z-10"
                >
                  {youtubeVideos.map((video: YoutubeVideo) => (
                    <div
                      key={video.id}
                      className="relative flex-shrink-0 w-80 snap-start overflow-visible z-10"
                    >
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
              </div>
            </div>
            <button
              onClick={() => scrollByBlock('right', scrollContainerRef)}
              className="absolute z-50 -right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
            >
              ▶
            </button>
            <div className="mt-6 mb-3 flex justify-center">
              <PaginationComponent
                count={pagination.total_pages}
                page={pagination.current_page}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* ランキング */}
      <HorizontalVideoShelf title="おすすめ動画" videos={topLikedVideos} setVideos={setTopLikedVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopLikedVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopLikedVideos); }} />
      <HorizontalVideoShelf title="注目動画" videos={topNotedVideos} setVideos={setTopNotedVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopNotedVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopNotedVideos); }} />
      <HorizontalVideoShelf title="新着動画" videos={topRecentVideos} setVideos={setTopRecentVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopRecentVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopRecentVideos); }} />

      {/* スナックバー */}
      {flashMessage && (
        <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {flashMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
