"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';

async function fetchYoutubeVideo(id: number) {
  const res = await fetch(`https://vimemo.fly.dev/api/v1/youtube_videos/${id}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${id}`);
  }

  const data = await res.json();
  console.log(data);  // レスポンスデータのログ出力
  return data;
}

const YoutubeVideoShowPage = () => {
  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId)) {
      fetchYoutubeVideo(videoId)
        .then(videoData => {
          setVideo(videoData.youtube_video);  // 期待するキーに注意
        })
        .catch(error => console.error('Error loading the video:', error));
    }
  }, [pathname]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{video.title || "タイトル不明"}</h1>
      <iframe
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
