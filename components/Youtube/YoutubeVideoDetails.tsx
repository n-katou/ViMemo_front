import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { CustomUser } from '../../types/user';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo;
  handleLike: () => void;
  handleUnlike: (likeId: number) => void;
  currentUser: CustomUser | null;
  liked: boolean;
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({ video, handleLike, handleUnlike, currentUser, liked }) => {
  const userLike = video?.likes ? video.likes.find(like => like.user_id === Number(currentUser?.id)) : null;

  return (
    <>
      <h1 className="video-title">{video?.title || "タイトル不明"}</h1>
      <div className="video-wrapper">
        <iframe
          className="w-full aspect-video"
          id="youtube-video"
          data-video-id={video?.youtube_id}
          src={`https://www.youtube.com/embed/${video?.youtube_id}?playsinline=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
      <p>公開日: {video ? new Date(video.published_at).toLocaleDateString() : "不明"}</p>
      <p>動画時間: {video ? video.duration : "不明"}分</p>

      <div id={`like_button_${video?.id}`}>
        {currentUser ? (
          <>
            {!liked ? (
              <button className="btn btn-outline btn-warning" onClick={handleLike}>
                いいね ({video?.likes_count || 0})
              </button>
            ) : (
              userLike && (
                <button className="btn btn-outline btn-success" onClick={() => handleUnlike(userLike.id)}>
                  いいねを取り消す ({video?.likes_count || 0})
                </button>
              )
            )}
          </>
        ) : (
          <p>ログインしてください</p>
        )}
      </div>
    </>
  );
};

export default YoutubeVideoDetails;
