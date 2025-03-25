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

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };


  const handleWatchNow = () => {
    const currentVideo = youtubeVideos[currentVideoIndex];
    router.push(`/youtube_videos/${currentVideo.id}`);
  };

  // ヒーロー動画を定期的に変更
  useEffect(() => {
    if (youtubeVideos.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * youtubeVideos.length);
      setCurrentVideoIndex(randomIndex);
    }, 7000); // 20秒ごと

    return () => clearInterval(interval);
  }, [youtubeVideos]);

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'}`}>
      {/* Heroセクション */}
      {youtubeVideos.length > 0 && (
        <div className="relative w-full h-[60vh] mb-12">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${youtubeVideos[currentVideoIndex].youtube_id}`}
            playing
            muted
            controls={false}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-4xl font-bold mb-4 max-w-2xl">
              {youtubeVideos[currentVideoIndex].title}
            </h2>
            <button
              onClick={handleWatchNow}
              className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-300 transition"
            >
              今すぐ見る
            </button>
          </div>
        </div>
      )}

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
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20"
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
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20"
            style={{ transform: 'translateY(-50%)' }}
          >
            ▶
          </button>
        </div>
      </div>

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
