"use client";

import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';

// サーバーサイドでデータをフェッチする非同期関数
async function fetchYoutubeVideos() {
  try {
    // const res = await fetch('http://back:3000/youtube_videos', {
    const res = await fetch('https://vimemo.fly.dev/youtube_videos', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null; // エラー時はnullを返す
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return data; // 成功時はデータを返す
    } else {
      console.error('Invalid data format');
      return null; // データ形式が不正の場合
    }
  } catch (error) {
    console.error('Fetch exception:', error);
    return null; // 例外発生時
  }
}

// AppディレクトリでのNext.jsコンポーネント
const YoutubeVideosPage = () => {
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ポーリングの間隔を設定（例：30秒）
  const POLLING_INTERVAL_MS = 30000;

  useEffect(() => {
    let isMounted = true; // コンポーネントがマウントされているかどうかを確認
    const fetchVideosWithPolling = async () => {
      while (isMounted) {
        const data = await fetchYoutubeVideos();

        if (data) {
          setYoutubeVideos(data);
          setError(null); // エラーがない場合、エラーメッセージをクリア
        } else {
          setError('データを取得できませんでした'); // エラー時
        }

        await new Promise((resolve) =>
          setTimeout(resolve, POLLING_INTERVAL_MS)
        ); // ポーリングの間隔
      }
    };

    fetchVideosWithPolling(); // ポーリングを開始

    return () => {
      isMounted = false; // クリーンアップでポーリングを停止
    };
  }, []); // 空の依存配列は、コンポーネントのマウント時にのみ実行

  if (error) {
    return (
      <div className="container">
        <h1>Youtube一覧</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Youtube一覧</h1>
      {youtubeVideos.length > 0 ? (
        youtubeVideos.map((video: YoutubeVideo) => (
          <div key={video.id} className="mb-6 text-left w-full">
            <h2>{video.title}</h2>
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
        ))
      ) : (
        <p>動画がありません。</p>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
