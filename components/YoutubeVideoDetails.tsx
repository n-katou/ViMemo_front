import React from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo;
  handleLike: () => void;
  handleUnlike: () => void;
  currentUser: any;
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({ video, handleLike, handleUnlike, currentUser }) => {
  return (
    <>
      <h1 className="video-title">{video.title || "タイトル不明"}</h1>
      <div className="video-wrapper">
        <iframe
          className="w-full aspect-video"
          id="youtube-video"
          data-video-id={video.youtube_id} // ここにdata-video-id属性を追加
          src={`https://www.youtube.com/embed/${video.youtube_id}?playsinline=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
      <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
      <p>動画時間: {video.duration}分</p>

      <div id={`like_button_${video.id}`}>
        {currentUser ? (
          <>
            <button className="btn btn-outline btn-warning" onClick={handleLike}>
              いいね ({video.likes_count})
            </button>
            <button className="btn btn-outline btn-success" onClick={handleUnlike}>
              いいねを取り消す ({video.likes_count})
            </button>
          </>
        ) : (
          <p>ログインしてください</p>
        )}
      </div>
    </>
  );
};

export default YoutubeVideoDetails;
