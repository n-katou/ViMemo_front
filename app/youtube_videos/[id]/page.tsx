"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // クエリパラメータ用フック
import { YoutubeVideo } from '../../types/youtubeVideo';

// 動画の詳細情報を取得する非同期関数
async function fetchYoutubeVideo(id: number) {
  const res = await fetch(`https://vimemo.fly.dev/youtube_videos/${id}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${id}`);
  }

  return res.json(); // データを取得
}

const YoutubeVideoShowPage = () => {
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const [video, setVideo] = useState<YoutubeVideo | null>(null);

  useEffect(() => {
    const id = searchParams.get("id"); // クエリからIDを取得
    console.log("ID:", id);
    if (id) {
      const videoId = parseInt(id, 10); // IDを数値に変換
      if (!isNaN(videoId)) {
        fetchYoutubeVideo(videoId)
          .then(setVideo)
          .catch((error) => {
            console.error("Error fetching video:", error); // エラーログ
            setVideo(null); // エラー時はnullに設定
          });
      }
    }
  }, [searchParams]); // クエリパラメータが変わるたびに実行

  if (!video) {
    return <div>Loading...</div>; // データ読み込み中
  }

  return (
    <div>
      <h1>{video.title || "タイトル不明"}</h1> {/* タイトルがあるか確認 */}
      <iframe
        src={`https://www.youtube.com/embed/${video.youtube_id || ""}`} // YouTube ID があるか確認
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <p>公開日: {new Date(video.published_at || Date.now()).toLocaleDateString()}</p> {/* 公開日 */}
      <p>動画時間: {video.duration || 0}分</p> {/* 動画時間 */}
    </div>
  );
};

export default YoutubeVideoShowPage;
