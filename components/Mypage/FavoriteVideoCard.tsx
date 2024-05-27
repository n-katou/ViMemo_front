import React from 'react';
import { useRouter } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NoteIcon from '@mui/icons-material/Note';
import { formatDuration } from '../../src/youtubeShowUtils';

interface VideoCardProps {
  video: YoutubeVideo;
  currentUser: any;
  handleLikeVideo: (id: number) => void;
  handleUnlikeVideo: (id: number, likeId: number | undefined) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, currentUser, handleLikeVideo, handleUnlikeVideo }) => {
  const router = useRouter();

  return (
    <div key={video.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="video-container relative">
        <iframe
          className="video absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h2
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
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
        <div className="flex items-center mt-2">
          {video.liked ? (
            <Tooltip title="いいね解除">
              <div className="flex items-center cursor-pointer" onClick={async () => {
                if (currentUser && video.likeId) {
                  await handleUnlikeVideo(video.id, video.likeId);
                }
              }}>
                <IconButton color="secondary">
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
                <IconButton color="primary">
                  <FavoriteBorderIcon />
                </IconButton>
                <span style={{ color: 'black' }}>いいねする</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
