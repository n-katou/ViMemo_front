import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Like } from '../../types/like';
import { useAuth } from '../../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { formatDuration } from '../../src/videoUtils';

interface YoutubeVideoCardProps {
  video: YoutubeVideo;
  handleTitleClick: (id: number) => void;
  handleLikeVideo: (id: number) => Promise<void>;
  handleUnlikeVideo: (id: number, likeId: number) => Promise<void>;
}

const YoutubeVideoCard: React.FC<YoutubeVideoCardProps> = ({ video, handleTitleClick, handleLikeVideo, handleUnlikeVideo }) => {
  const { currentUser } = useAuth();

  console.log('Rendering YoutubeVideoCard with video:', video); // デバッグ用ログ

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative pb-56.25%">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h2
          onClick={() => handleTitleClick(video.id)}
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
        >
          {video.title}
        </h2>
        <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
        <div className="flex items-center">
          <FavoriteIcon className="text-red-500 mr-1" />
          <p className="text-gray-600">{video.likes_count}</p>
        </div>
        <div className="flex items-center">
          <NoteIcon className="text-blue-500 mr-1" />
          <p className="text-gray-600">{video.notes_count}</p>
        </div>
        {currentUser && (
          <div className="flex items-center mt-2">
            {video.liked ? (
              <Tooltip title="いいね解除">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  if (currentUser) {
                    const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                    if (like) {
                      await handleUnlikeVideo(video.id, like.id);
                    }
                  }
                }}>
                  <IconButton
                    color="secondary"
                  >
                    <FavoriteIcon style={{ color: 'red' }} />
                  </IconButton>
                  <span style={{ color: 'black' }}>いいね解除</span>
                </div>
              </Tooltip>
            ) : (
              <Tooltip title="いいね">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  await handleLikeVideo(video.id);
                }}>
                  <IconButton
                    color="primary"
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                  <span style={{ color: 'black' }}>いいねする</span>
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .relative {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }
        .absolute {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default YoutubeVideoCard;
