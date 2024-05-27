import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PaginationComponent from '../components/Pagination';
import { fetchYoutubeVideos, handleLikeVideo, handleUnlikeVideo } from '../src/youtubeVideoUtils';
import { formatDuration } from '../src/videoUtils';

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
              <div key={video.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative pb-56.25%">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h2
                    onClick={() => handleTitleClick(video.id)}
                    className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                  >
                    {video.title}
                  </h2>
                  <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
                  <div className="flex items-center">
                    <FavoriteIcon className="text-red-500 mr-1" />
                    <p className="text-gray-600">{video.likes_count}</p>
                  </div>
                  <div className="flex items-center">
                    <NoteIcon className="text-blue-500 mr-1" />
                    <p className="text-gray-600">{video.notes_count}</p>
                  </div>
                  {currentUser && (
                    <div className="flex items-center mt-2">
                      {video.liked ? (
                        <Tooltip title="いいね解除">
                          <div className="flex items-center cursor-pointer" onClick={async () => {
                            if (currentUser) {
                              const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                              if (like) {
                                await handleUnlikeVideoWrapper(video.id, like.id);
                              }
                            }
                          }}>
                            <IconButton
                              color="secondary"
                            >
                              <FavoriteIcon style={{ color: 'red' }} />
                            </IconButton>
                            <span style={{ color: 'black' }}>いいね解除</span>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip title="いいね">
                          <div className="flex items-center cursor-pointer" onClick={async () => {
                            await handleLikeVideoWrapper(video.id);
                          }}>
                            <IconButton
                              color="primary"
                            >
                              <FavoriteBorderIcon />
                            </IconButton>
                            <span style={{ color: 'black' }}>いいねする</span>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
      <style jsx>{`
        .relative {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }
        .absolute {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default YoutubeVideosPage;
