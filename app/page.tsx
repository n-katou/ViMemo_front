import React from 'react';

// サーバーサイドでデータをフェッチする非同期関数
async function fetchYoutubeVideos() {
  try {
    const res = await fetch('http://back:3000/youtube_videos', {
      headers: {
        'Accept': 'application/json',  // この部分を調整
      },
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch exception:', error);
    return [];
  }
}


// サーバーサイドデータフェッチを使用するNext.jsコンポーネント
const YoutubeVideosPage = async () => {
  const youtube_videos = await fetchYoutubeVideos();  // サーバーサイドでデータを取得

  return (
    <div className="container">
      <h1>Youtube一覧</h1>
      {youtube_videos.length > 0 ? (
        <ul>
          {youtube_videos.map((video) => (
            <li key={video.id}>{video.title}</li>  // 動画のタイトルを表示
          ))}
        </ul>
      ) : (
        <p>動画がありません。</p>
      )}
    </div>
  );
};

export default YoutubeVideosPage;
