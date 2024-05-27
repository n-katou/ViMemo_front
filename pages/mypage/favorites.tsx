import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import PaginationComponent from '../../components/Pagination';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NoteIcon from '@mui/icons-material/Note';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchFavorites, fetchVideoLikes, fetchUserLikeStatus, handleLike, handleUnlike } from '../../src/favorites';
import { formatDuration } from '../../src/youtubeShowUtils';

const ITEMS_PER_PAGE = 9;

const FavoritesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });
  const [sortOption, setSortOption] = useState<string>('created_at_desc');

  const fetchAndSetFavorites = async (page = 1, sort = sortOption) => {
    setLoading(true);
    try {
      const result = await fetchFavorites(page, sort, jwtToken, currentUser, ITEMS_PER_PAGE);
      if (result) {
        setVideos(result.videos);
        setPagination(result.pagination);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetFavorites(pagination.current_page);
  }, [pagination.current_page, sortOption]);

  const handleLikeVideo = async (id: number) => {
    await handleLike(id, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  const handleUnlikeVideo = async (youtubeVideoId: number, likeId: number | undefined) => {
    await handleUnlike(youtubeVideoId, likeId, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  };

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <select value={sortOption} onChange={handleSortChange} className="form-select text-white bg-gray-800 border-gray-600">
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
      <h1 className="text-2xl font-bold mb-4">いいねした動画一覧</h1>
      {videos && videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video: YoutubeVideo) => (
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
                    className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/youtube_videos/${video.id}`)}
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
                  <div className="flex items-center mt-2">
                    {video.liked ? (
                      <Tooltip title="いいね解除">
                        <div className="flex items-center cursor-pointer" onClick={async () => {
                          if (currentUser && video.likeId) {
                            await handleUnlikeVideo(video.id, video.likeId);
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
                          await handleLikeVideo(video.id);
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
                </div>
              </div>
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
          />
        </>
      ) : <p>お気に入りの動画はありません。</p>}
      <style jsx>{`
        .relative {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
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

export default FavoritesPage;
