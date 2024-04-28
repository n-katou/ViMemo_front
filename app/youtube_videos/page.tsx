"use client";

import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';

// サーバーサイドでデータをフェッチする非同期関数
async function fetchYoutubeVideos() {
  try {
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
      return data; // データが配列であれば、成功と見なす
    } else {
      console.error('Invalid data format');
      return null; // データ形式が不正な場合
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchYoutubeVideos();

      if (data) {
        setYoutubeVideos(data); // フェッチ成功時に状態を更新
        setError(null); // エラーメッセージをクリア
      } else {
        setError('YouTube動画を取得できませんでした'); // エラー時
      }
    };

    fetchData(); // データフェッチを開始
  }, []); // コンポーネントがマウントされたときに一度だけ実行

  if (error) {
    return (
      <div className="container">
        <h1>YouTube一覧</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>YouTube一覧</h1>
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
        <p>動画がありません。</p> // データがない場合のメッセージ
      )}
    </div>
  );
};

export default YoutubeVideosPage;
