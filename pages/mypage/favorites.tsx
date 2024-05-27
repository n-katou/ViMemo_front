import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { YoutubeVideo } from '../../types/youtubeVideo';
import PaginationComponent from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchFavorites, fetchVideoLikes, fetchUserLikeStatus, handleLike, handleUnlike } from '../../src/favorites';
import VideoCard from '../../components/Mypage/FavoriteVideoCard';

const ITEMS_PER_PAGE = 9;

const FavoritesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
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
              <VideoCard
                key={video.id}
                video={video}
                currentUser={currentUser}
                handleLikeVideo={handleLikeVideo}
                handleUnlikeVideo={handleUnlikeVideo}
              />
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
          />
        </>
      ) : <p>お気に入りの動画はありません。</p>}
    </div>
  );
};

export default FavoritesPage;
