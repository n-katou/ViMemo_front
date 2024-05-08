"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth'; // 認証用カスタムフックをインポート

async function fetchYoutubeVideo(id: number, token: string) {
  const res = await fetch(`https://vimemo.fly.dev/api/youtube_videos/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,  // 認証トークンをヘッダーに追加
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${id}`);
  }

  const data = await res.json();
  return data;
}

const YoutubeVideoShowPage = () => {
  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const pathname = usePathname();
  const { user } = useFirebaseAuth(); // 認証状態を取得

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId) && user) {
      user.getIdToken().then(token => {
        fetchYoutubeVideo(videoId, token)
          .then(videoData => {
            setVideo(videoData.youtube_video);
          })
          .catch(error => console.error('Error loading the video:', error));
      });
    }
  }, [pathname, user]);

  if (!user) {
    return <div>Please log in to view this video.</div>; // ログインしていない場合の表示
  }

  if (!video) {
    return <div>Loading...</div>; // ビデオ情報がまだない場合の表示
  }

  return (
    <div>
      <h1>{video.title || "タイトル不明"}</h1>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${video.youtube_id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
      <p>動画時間: {video.duration}分</p>
    </div>
  );
};

export default YoutubeVideoShowPage;
