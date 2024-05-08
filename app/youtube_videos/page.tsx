"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

async function fetchYoutubeVideos(page = 1, token: string) {
  try {
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const res = await fetch(`https://vimemo.fly.dev/api/youtube_videos?page=${page}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch exception:', error);
    return null;
  }
}

const YoutubeVideosPage = () => {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    next_page: 2,
    prev_page: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('ログインが必要です');
        return;
      }
      const token = await user.getIdToken();
      const result = await fetchYoutubeVideos(pagination.current_page, token);
      if (result) {
        setYoutubeVideos(result.videos);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError('YouTube動画を取得できませんでした');
      }
    };
    fetchData();
  }, [pagination.current_page, user]);

  const handleTitleClick = async (id: number) => {
    await router.push(`/youtube_videos/${id}`);
  };

  if (!user) {
    return (
      <div className="container">
        <h1>YouTube一覧</h1>
        <p>ログインしてください。</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>YouTube一覧</h1>
      {youtubeVideos.length > 0 ? (
        <>
          {youtubeVideos.map((video) => (
            <div key={video.id} className="mb-6 text-left w-full">
              <h2 onClick={() => handleTitleClick(video.id)} style={{ cursor: 'pointer' }}>
                {video.title}
              </h2>
              <div className="video-wrapper">
                <iframe
                  className="aspect-video"
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
              <p>動画時間: {video.duration}分</p>
            </div>
          ))}
          <div className="pagination">
            {pagination.prev_page && (
              <button onClick={() => setPagination({ ...pagination, current_page: pagination.prev_page })}>前ページ</button>
            )}
            {pagination.next_page && (
              <button onClick={() => setPagination({ ...pagination, current_page: pagination.next_page })}>次ページ</button>
            )}
          </div>
        </>
      ) : (
        <p>動画がありません。</p>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
