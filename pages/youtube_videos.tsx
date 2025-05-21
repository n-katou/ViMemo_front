import React, { useEffect, useState, useRef } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import HorizontalVideoShelf from '../components/HorizontalVideoShelf';
import LoadingSpinner from '../components/LoadingSpinner';

import YoutubeHeroSection from '../components/YoutubeIndex/YoutubeHeroSection';
import VideoHorizontalScroll from '../components/YoutubeIndex/VideoHorizontalScroll';
import SearchHeader from '../components/YoutubeIndex/SearchHeader';
import VideoGrid from '../components/YoutubeIndex/VideoGrid';

import useYoutubeVideosPage from '../hooks/youtube_videos/index/useYoutubeVideosPage';
import useDisplayMode from '../hooks/youtube_videos/index/useDisplayMode';
import useYoutubeVideoRankings from '../hooks/youtube_videos/index/useYoutubeVideoRankings';

import { handleLikeVideo, handleUnlikeVideo, fetchRandomYoutubeVideo, scrollByBlock } from '../components/YoutubeIndex/youtubeIndexUtils';
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
  const [currentVideoIndex] = useState(0);
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMuted, setIsMuted] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { displayMode, toggleDisplayMode, queryKeyword } = useDisplayMode();


  const {
    topLikedVideos,
    // topNotedVideos,
    topRecentVideos,
    loading: rankingLoading,
    setTopLikedVideos,
    // setTopNotedVideos,
    setTopRecentVideos,
  } = useYoutubeVideoRankings();

  useEffect(() => {
    if (isMobile) setIsMuted(true);
  }, [currentVideoIndex, isMobile]);

  const toggleMute = () => setIsMuted(prev => !prev);

  useEffect(() => {
    if (router.pathname !== '/youtube_videos') return; // /youtube_videos 以外は処理しない
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
  }, [router.pathname, youtubeVideos, isMobile]);

  const handleScrollByBlock = (
    direction: 'left' | 'right',
    ref: React.RefObject<HTMLDivElement>
  ) => {
    scrollByBlock(direction, ref, isMobile);
  };

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'}`}>
      {/* スナックバー */}
      {flashMessage && (
        <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {flashMessage}
          </Alert>
        </Snackbar>
      )}

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
              scrollByBlock={handleScrollByBlock}
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

              {/* <HorizontalVideoShelf title="注目動画" videos={topNotedVideos} setVideos={setTopNotedVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopNotedVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopNotedVideos); }} /> */}

              <HorizontalVideoShelf title="新着動画" videos={topRecentVideos} setVideos={setTopRecentVideos} notes={notes} jwtToken={jwtToken} setNotes={setNotes} onClickTitle={handleTitleClick} onLike={async (id) => { if (!jwtToken || !currentUser) return; await handleLikeVideo(id, jwtToken, currentUser, setTopRecentVideos); }} onUnlike={async (id, likeId) => { if (!jwtToken || !currentUser) return; await handleUnlikeVideo(id, likeId, jwtToken, currentUser, setTopRecentVideos); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
