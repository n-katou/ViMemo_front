"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  userId: string;  // JWTのペイロードに含まれる想定のユーザーIDフィールド
  email: string;   // メールアドレスフィールド
  name: string;    // ユーザー名フィールド
}

interface User {
  id: string; // JWTのデコードから得られるuserIdをidとして使用
  email: string;
  name: string;
}


async function fetchYoutubeVideos(page = 1) {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    'Accept': 'application/json',
    'Authorization': authToken ? `Bearer ${authToken}` : ''
  };

  const res = await fetch(`https://vimemo.fly.dev/api/v1/youtube_videos?page=${page}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });

  if (!res.ok) {
    console.error('Fetch error:', res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  return data && Array.isArray(data.videos) ? { videos: data.videos, pagination: data.pagination } : null;
}

const YoutubeVideosPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    next_page: 2,
    prev_page: 0,
  });

  const handleTitleClick = async (id: number) => {
    console.log("遷移前のID:", id); // 遷移前のIDをログに出力
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl); // 指定したURLに遷移
    console.log("遷移後のURL:", cleanUrl); // 遷移後のURLをログに出力
  };
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ userId: string; email: string; name: string }>(token);
        setCurrentUser({
          id: decodedToken.userId,
          email: decodedToken.email,
          name: decodedToken.name,
        });
        fetchData();
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [pagination.current_page, router]);

  async function fetchData() {
    const result = await fetchYoutubeVideos(pagination.current_page);
    if (result) {
      setYoutubeVideos(result.videos);
      setPagination(result.pagination);
      setError(null);
    } else {
      setError('YouTube動画を取得できませんでした');
    }
  }

  if (error) {
    return <div className="container"><h1>YouTube一覧</h1><p>{error}</p></div>;
  }

  return (
    <div className="container">
      <h1>YouTube一覧</h1>
      {youtubeVideos.length > 0 ? (
        <>
          {youtubeVideos.map(video => (
            <div key={video.id} className="mb-6 text-left w-full">
              <h2 onClick={() => handleTitleClick(video.id)}>{video.title}</h2>
              <iframe src={`https://www.youtube.com/embed/${video.youtube_id}`} frameBorder="0" allowFullScreen />
              <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
              <p>動画時間: {video.duration}分</p>
            </div>
          ))}
          <div className="pagination">
            {pagination.prev_page && <button onClick={() => setPagination({ ...pagination, current_page: pagination.prev_page })}>前ページ</button>}
            {pagination.next_page && <button onClick={() => setPagination({ ...pagination, current_page: pagination.next_page })}>次ページ</button>}
          </div>
        </>
      ) : <p>動画がありません。</p>}
    </div>
  );
};

export default YoutubeVideosPage;
