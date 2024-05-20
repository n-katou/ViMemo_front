"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 12; // 1ページあたりの動画数を設定

async function fetchYoutubeVideos(query = '', page = 1, itemsPerPage = ITEMS_PER_PAGE) {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}&per_page=${itemsPerPage}`, {
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

const YoutubeVideosPage = () => {
  const { currentUser } = useAuth();
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
      const result = await fetchYoutubeVideos(query, pagination.current_page);

      if (result) {
        setYoutubeVideos(result.videos);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError('YouTube動画を取得できませんでした');
      }
      setLoading(false);
    };

    fetchData();
  }, [pagination.current_page, currentUser, router, query]);

  const handleTitleClick = async (id: number) => {
    console.log("遷移前のID:", id);
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
    console.log("遷移後のURL:", cleanUrl);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      {youtubeVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map(video => (
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
                  <p className="text-gray-600">動画時間: {video.duration}分</p>
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
