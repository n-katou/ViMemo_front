import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';
import { useRouter } from 'next/router';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationData {
  current_page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

const ITEMS_PER_PAGE = 9;

const FavoritesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });

  const fetchFavorites = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`, {
        params: { page, per_page: ITEMS_PER_PAGE },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (res.data) {
        setVideos(res.data.videos.map((video: YoutubeVideo) => ({
          ...video,
          liked: video.likes.some((like: Like) => like.user_id === Number(currentUser?.id)),
          likeId: video.likes.find((like: Like) => like.user_id === Number(currentUser?.id))?.id || undefined,
        })));
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('お気に入りの動画を取得できませんでした。');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoLikes = async (videoId: number) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching video likes:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchFavorites(pagination.current_page);
  }, [pagination.current_page]);

  const handleLike = async (id: number) => {
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
        return;
      }

      const likeData = await fetchVideoLikes(id);
      if (likeData) {
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === id ? {
              ...video,
              likes_count: likeData.likes_count,
              likes: likeData.likes,
              liked: true,
              likeId: data.like ? data.like.id : video.likeId,
            } : video
          )
        );
      }
    } catch (error) {
      console.error('Like exception:', error);
    }
  };

  const handleUnlike = async (youtubeVideoId: number, likeId: number | undefined) => {
    if (!likeId) {
      console.error('Unlike error: likeId is undefined');
      return;
    }

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
        return;
      }

      const likeData = await fetchVideoLikes(youtubeVideoId);
      if (likeData) {
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === youtubeVideoId ? {
              ...video,
              likes_count: likeData.likes_count,
              likes: likeData.likes,
              liked: false,
              likeId: undefined,
            } : video
          )
        );
      }
    } catch (error) {
      console.error('Unlike exception:', error);
    }
  };

  const handleTitleClick = (id: number) => {
    router.push(`/youtube_videos/${id}`);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">お気に入りの動画</h1>
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
                    onClick={() => handleTitleClick(video.id)}
                  >
                    {video.title}
                  </h2>
                  <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">いいね数: {video.likes_count}</p>
                  <p className="text-gray-600">メモ数: {video.notes_count}</p>
                  {video.liked ? (
                    <button
                      onClick={async () => {
                        if (currentUser && video.likeId) {
                          await handleUnlike(video.id, video.likeId);
                        }
                      }}
                      className="mt-2 btn btn-secondary py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
                    >
                      いいね解除
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await handleLike(video.id);
                      }}
                      className="mt-2 btn btn-primary py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                    >
                      いいね
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Stack spacing={2} className="mt-8">
            <Pagination
              count={pagination.total_pages}
              page={pagination.current_page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              size="large"
            />
          </Stack>
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
