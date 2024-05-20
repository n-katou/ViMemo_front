import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { CustomUser } from '../../types/user';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo;
  handleLike: () => void;
  handleUnlike: () => void;
  currentUser: CustomUser | null;
  liked: boolean;
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({ video, handleLike, handleUnlike, currentUser, liked }) => {
  return (
    <div className="video-details">
      <h1>{video.title}</h1>
      <iframe
        className="video-frame"
        src={`https://www.youtube.com/embed/${video.youtube_id}`}
        frameBorder="0"
        allowFullScreen
      />
      <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
      <p>動画時間: {video.formattedDuration}</p> {/* フォーマットされた時間を表示 */}
      <div>
        {liked ? (
          <button onClick={handleUnlike} className="btn btn-secondary">いいねを取り消す</button>
        ) : (
          <button onClick={handleLike} className="btn btn-primary">いいね</button>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDetails;
