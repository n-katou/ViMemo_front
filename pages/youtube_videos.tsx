import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PaginationComponent from '../components/Pagination';
import { fetchYoutubeVideos, handleLikeVideo, handleUnlikeVideo } from '../src/youtubeVideoUtils';

import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';

const ITEMS_PER_PAGE = 9;

const YoutubeVideosPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
  }>({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const query = router.query.query as string || '';

  const fetchData = async () => {
    setLoading(true);
    const result = await fetchYoutubeVideos(query, pagination.current_page, ITEMS_PER_PAGE, sortOption);

    if (result) {
      const updatedVideos = result.videos.map((video: YoutubeVideo) => ({
        ...video,
        liked: video.likes?.some((like: Like) => like.user_id === Number(currentUser?.id)) || false,
        likeId: video.likes?.find((like: Like) => like.user_id === Number(currentUser?.id))?.id || undefined,
      }));
      setYoutubeVideos(updatedVideos);
      setPagination(result.pagination);
      setError(null);
    } else {
      setError('YouTube動画を取得できませんでした');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current_page, query, sortOption]);

  useEffect(() => {
    if (router.query.flashMessage) {
      setFlashMessage(router.query.flashMessage as string);
      setShowSnackbar(true);
      const { flashMessage, ...rest } = router.query;
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true });
    }
  }, [router.query]);

  const handleTitleClick = async (id: number) => {
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleLikeVideoWrapper = async (id: number) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    await handleLikeVideo(id, jwtToken!, currentUser, setYoutubeVideos);
  };

  const handleUnlikeVideoWrapper = async (youtubeVideoId: number, likeId: number) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    await handleUnlikeVideo(youtubeVideoId, likeId, jwtToken!, currentUser, setYoutubeVideos);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessage(null);
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className="form-select form-select-lg text-white bg-gray-800 border-gray-600"
        >
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
      {youtubeVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video: YoutubeVideo) => (
              <YoutubeVideoCard
                key={video.id}
                video={video}
                handleTitleClick={handleTitleClick}
                handleLikeVideo={handleLikeVideoWrapper}
                handleUnlikeVideo={handleUnlikeVideoWrapper}
              />
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={(event, value) => setPagination({ ...pagination, current_page: value })}
          />
        </>
      ) : <p>動画がありません。</p>}
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
