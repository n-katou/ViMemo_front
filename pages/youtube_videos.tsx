import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';
import { Like } from '../types/like';

const ITEMS_PER_PAGE = 9; // 1ページあたりの動画数を設定

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

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

const YoutubeVideosPage = () => {
  const { currentUser, jwtToken } = useAuth();  // jwtTokenを追加
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
  const [sortOption, setSortOption] = useState<string>('created_at_desc'); // ソートオプションの初期値を設定

  const query = router.query.query as string || '';

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      setYoutubeVideos([]);
      setError(null);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchYoutubeVideos(query, pagination.current_page, ITEMS_PER_PAGE, sortOption);

      if (result) {
        // `liked` プロパティを追加して設定する
        const updatedVideos = result.videos.map((video: YoutubeVideo) => ({
          ...video,
          liked: video.likes?.some((like: Like) => like.user_id === Number(currentUser.id)) || false
        }));
        setYoutubeVideos(updatedVideos);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError('YouTube動画を取得できませんでした');
      }
      setLoading(false);
    };

    fetchData();
  }, [pagination.current_page, currentUser, router, query, sortOption]);

  const handleTitleClick = async (id: number) => {
    console.log("遷移前のID:", id);
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
    console.log("遷移後のURL:", cleanUrl);
  };

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    setPagination({ ...pagination, current_page: 1 }); // ソートオプションが変更されたら最初のページに戻る
  };

  const handleLike = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}/likes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // localStorageではなく、useAuthから直接取得
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
        setYoutubeVideos((prevVideos) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === id ? { ...video, likes_count: data.likes_count, liked: true } : video
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
          'Authorization': `Bearer ${jwtToken}`, // localStorageではなく、useAuthから直接取得
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likeable_type: 'YoutubeVideo', // ここに likeable_type を追加
          likeable_id: youtubeVideoId,   // ここに likeable_id を追加
        }),
      });

      if (!res.ok) {
        console.error('Unlike error:', res.status, res.statusText);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setYoutubeVideos((prevVideos) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === youtubeVideoId ? { ...video, likes_count: data.likes_count, liked: false } : video
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
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className="form-select form-select-lg"
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
                  <p className="text-gray-600">いいね数: {video.likes_count}</p>
                  <p className="text-gray-600">メモ数: {video.notes_count}</p>
                  {video.liked ? (
                    <button
                      onClick={async () => {
                        if (currentUser) {
                          const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                          if (like) {
                            await handleUnlike(video.id, like.id);
                            const updatedVideos = youtubeVideos.map((v) =>
                              v.id === video.id ? { ...v, liked: false, likes_count: v.likes_count - 1 } : v
                            );
                            setYoutubeVideos(updatedVideos);
                          }
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
                        const updatedVideos = youtubeVideos.map((v) =>
                          v.id === video.id ? { ...v, liked: true, likes_count: v.likes_count + 1 } : v
                        );
                        setYoutubeVideos(updatedVideos);
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
            {pagination.prev_page && (
              <button
                onClick={() => setPagination({ ...pagination, current_page: pagination.prev_page! })}
                className="btn btn-primary py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              >
                前ページ
              </button>
            )}
            <span className="text-gray-700">
              {pagination.current_page} / {pagination.total_pages}
            </span>
            {pagination.next_page && (
              <button
                onClick={() => setPagination({ ...pagination, current_page: pagination.next_page! })}
                className="btn btn-primary py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              >
                次ページ
              </button>
            )}
          </div>
        </>
      ) : <p>動画がありません。</p>}
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
