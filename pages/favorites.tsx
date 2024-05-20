import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';

interface Pagination {
  current_page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

const FavoritesPage = () => {
  const { currentUser, jwtToken } = useAuth();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });

  const fetchFavorites = async (page = 1) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`, {
        params: { page },
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

  useEffect(() => {
    fetchFavorites();
  }, []);

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
      if (data.success) {
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === id ? { ...video, likes_count: video.likes_count + 1, liked: true, likeId: data.like.id } : video
          )
        );
      } else {
        console.error('Like error:', data.message);
      }
    } catch (error) {
      console.error('Like exception:', error);
    }
  };

  const handleUnlike = async (youtubeVideoId: number, likeId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/likes/${likeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likeable_type: 'YoutubeVideo',
          likeable_id: youtubeVideoId,
        }),
      });

      if (!res.ok) {
        console.error('Unlike error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === youtubeVideoId ? { ...video, likes_count: video.likes_count - 1, liked: false, likeId: undefined } : video
          )
        );
      } else {
        console.error('Unlike error:', data.message);
      }
    } catch (error) {
      console.error('Unlike exception:', error);
    }
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
                  <h2 className="text-xl font-bold text-blue-600">{video.title}</h2>
                  <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">いいね数: {video.likes_count}</p>
                  <p className="text-gray-600">メモ数: {video.notes_count}</p>
                  {video.liked ? (
                    <button
                      onClick={async () => {
                        if (currentUser) {
                          await handleUnlike(video.id, video.likeId!);
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
          <div className="pagination mt-8 flex justify-center items-center space-x-4">
            {pagination.prev_page !== null && (
              <button
                onClick={() => fetchFavorites(pagination.prev_page!)}
                className="btn btn-primary py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              >
                前ページ
              </button>
            )}
            <span className="text-gray-700">
              {pagination.current_page} / {pagination.total_pages}
            </span>
            {pagination.next_page !== null && (
              <button
                onClick={() => fetchFavorites(pagination.next_page!)}
                className="btn btn-primary py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              >
                次ページ
              </button>
            )}
          </div>
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
