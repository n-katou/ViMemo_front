import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';
import { Like } from '../types/like';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ITEMS_PER_PAGE = 9;

async function fetchYoutubeVideos(query = '', page = 1, itemsPerPage = ITEMS_PER_PAGE, sort = '') {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}&per_page=${itemsPerPage}&sort=${sort}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (data && Array.isArray(data.videos)) {
      return { videos: data.videos, pagination: data.pagination };
    } else {
      console.error('Invalid data format');
      return null;
    }
  } catch (error) {
    console.error('Fetch exception:', error);
    return null;
  }
}

async function fetchVideoLikes(id: number) {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}/likes`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch exception:', error);
    return null;
  }
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

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
      // クエリパラメータからフラッシュメッセージを削除
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

  const handleLike = async (id: number) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
      prevVideos.map((video: YoutubeVideo) =>
        video.id === id ? { ...video, likes_count: video.likes_count + 1, liked: true } : video
      )
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likeable_type: 'YoutubeVideo',
          likeable_id: id,
        }),
      });

      if (!res.ok) {
        console.error('Like error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        console.error('Like error:', data.message);
      } else {
        const likeData = await fetchVideoLikes(id);
        if (likeData) {
          setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
            prevVideos.map((video: YoutubeVideo) =>
              video.id === id ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: true } : video
            )
          );
        }
      }
    } catch (error) {
      console.error('Like exception:', error);
    }
  };

  const handleUnlike = async (youtubeVideoId: number, likeId: number) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
      prevVideos.map((video: YoutubeVideo) =>
        video.id === youtubeVideoId ? { ...video, likes_count: video.likes_count - 1, liked: false } : video
      )
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/likes/${likeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Unlike error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        console.error('Unlike error:', data.message);
      } else {
        const likeData = await fetchVideoLikes(youtubeVideoId);
        if (likeData) {
          setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
            prevVideos.map((video: YoutubeVideo) =>
              video.id === youtubeVideoId ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: false } : video
            )
          );
        }
      }
    } catch (error) {
      console.error('Unlike exception:', error);
    }
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
                          <IconButton
                            onClick={async () => {
                              if (currentUser) {
                                const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                                if (like) {
                                  await handleUnlike(video.id, like.id);
                                }
                              }
                            }}
                            color="secondary"
                          >
                            <FavoriteIcon style={{ color: 'red' }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="いいね">
                          <IconButton
                            onClick={async () => {
                              await handleLike(video.id);
                            }}
                            color="primary"
                          >
                            <FavoriteBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <p className="ml-2">{video.liked ? 'いいね済み' : 'いいねする'}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Stack spacing={2} className="mt-8">
            <Pagination
              count={pagination.total_pages}
              page={pagination.current_page}
              onChange={(event, value) => setPagination({ ...pagination, current_page: value })}
              variant="outlined"
              shape="rounded"
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
              }}
            />
          </Stack>
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
