import React, { useEffect, useState, useRef } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import PaginationComponent from '../components/Pagination';
import HorizontalVideoShelf from '../components/HorizontalVideoShelf';
import LoadingSpinner from '../components/LoadingSpinner';

import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';
import YoutubeHeroSection from '../components/YoutubeIndex/YoutubeHeroSection';
import VideoHorizontalScroll from '../components/YoutubeIndex/VideoHorizontalScroll';
import SearchHeader from '../components/YoutubeIndex/SearchHeader';
import VideoGrid from '../components/YoutubeIndex/VideoGrid';

import useYoutubeVideosPage from '../hooks/youtube_videos/useYoutubeVideosPage';

import useYoutubeVideoRankings from '../components/YoutubeIndex/useYoutubeVideoRankings';
import { handleLikeVideo, handleUnlikeVideo, fetchRandomYoutubeVideo } from '../components/YoutubeIndex/youtubeIndexUtils';
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

  const [displayMode, setDisplayMode] = useState<'horizontal' | 'grid'>('horizontal');

  const queryKeyword = router.query.query as string | undefined;

  const toggleDisplayMode = () => {
    const newMode = displayMode === 'horizontal' ? 'grid' : 'horizontal';
    setDisplayMode(newMode);
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, displayMode: newMode },
    }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (router.query.displayMode === 'grid') {
      setDisplayMode('grid');
    } else {
      setDisplayMode('horizontal');
    }
  }, [router.query.displayMode]);

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
          <SearchHeader
            queryKeyword={queryKeyword}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
            displayMode={displayMode}
            toggleDisplayMode={toggleDisplayMode}
            theme={theme}
          />
          {displayMode === 'horizontal' ? (
            <VideoHorizontalScroll
              youtubeVideos={youtubeVideos}
              notes={notes}
              jwtToken={jwtToken}
              scrollContainerRef={scrollContainerRef}
              scrollByBlock={scrollByBlock}
              handleTitleClick={handleTitleClick}
              handleLikeVideo={handleLikeVideoWrapper}
              handleUnlikeVideo={handleUnlikeVideoWrapper}
              setNotes={setNotes}
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          ) : (
            <VideoGrid
              youtubeVideos={youtubeVideos}
              notes={notes}
              jwtToken={jwtToken}
              handleTitleClick={handleTitleClick}
              handleLikeVideo={handleLikeVideoWrapper}
              handleUnlikeVideo={handleUnlikeVideoWrapper}
              setNotes={setNotes}
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          )}
          {displayMode === 'horizontal' && (
            <>
              {/* ランキング */}
              <HorizontalVideoShelf title="おすすめ動画" videos={topLikedVideos} setVideos={setTopLikedVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopLikedVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopLikedVideos); }} />

              <HorizontalVideoShelf title="注目動画" videos={topNotedVideos} setVideos={setTopNotedVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopNotedVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopNotedVideos); }} />

              <HorizontalVideoShelf title="新着動画" videos={topRecentVideos} setVideos={setTopRecentVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopRecentVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopRecentVideos); }} />
            </>
          )}

          {/* スナックバー */}
          {flashMessage && (
            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                {flashMessage}
              </Alert>
            </Snackbar>
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
