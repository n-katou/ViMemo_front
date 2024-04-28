import React from 'react';

// サーバーサイドでデータをフェッチする非同期関数
async function fetchYoutubeVideos() {
  try {
    // const res = await fetch('http://back:3000/youtube_videos', {
    const res = await fetch('https://vimemo.fly.dev//youtube_videos', {
      headers: {
        'Accept': 'application/json',
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

// AppディレクトリでのNext.jsコンポーネント
const YoutubeVideosPage = async () => {
  const youtube_videos = await fetchYoutubeVideos();

  return (
    <div className="container">
      <h1>Youtube一覧</h1>
      {youtube_videos.length > 0 ? (
        youtube_videos.map((video) => (
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
