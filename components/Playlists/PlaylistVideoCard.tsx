import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoteIcon from '@mui/icons-material/Note';
import { formatDuration } from '../YoutubeShow/youtubeShowUtils';
import LikeButton from './PlaylistsLikeButton';
import ReactPlayer from 'react-player/youtube';

interface VideoCardProps {
  video: YoutubeVideo;
  currentUser: any;
  handleLikeVideo: (id: number) => void;
  handleUnlikeVideo: (id: number, likeId: number | undefined) => void;
  index: number;
  className?: string;
}

const PlaylistVideoCard: React.FC<VideoCardProps> = ({
  video,
  currentUser,
  handleLikeVideo,
  handleUnlikeVideo,
  index,
  className,
}) => {
  const router = useRouter();

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLikeClick = async () => {
    if (video.liked && currentUser && video.likeId) {
      await handleUnlikeVideo(video.id, video.likeId);
    } else {
      await handleLikeVideo(video.id);
    }
  };

  return (
    <div className={`relative mb-2 border border-gray-200 rounded-md shadow-sm bg-white p-2 ${className}`}>
      {/* 本体：サムネイル & 情報 */}
      <div className="flex items-start gap-3">
        {/* サムネイル or プレイヤー */}
        <div className="relative w-48 h-48">
          {isPlaying ? (
            <div className="relative w-full h-full">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                playing
                controls={false}
                muted={isMuted}
                width="100%"
                height="100%"
                onEnded={() => setIsPlaying(false)}
              />
              <button
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 z-10"
                onClick={() => setIsPlaying(false)}
              >
                <span className="text-white text-sm">×</span>
              </button>
              <button
                className="absolute bottom-1 right-1 bg-black bg-opacity-50 rounded-full p-1 z-10"
                onClick={() => setIsMuted(!isMuted)}
              >
                <span className="text-white text-xs">{isMuted ? '🔇' : '🔊'}</span>
              </button>
            </div>
          ) : (
            <img
              src={thumbnailUrl}
              alt={`thumbnail-${video.id}`}
              className="w-full h-full rounded-md object-cover cursor-pointer"
              onClick={() => setIsPlaying(true)}
            />
          )}
        </div>

        {/* タイトル & 情報 */}
        <div className="flex-1 text-sm space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 font-medium">{index + 1}.</span>
            <h2
              className="text-blue-600 font-semibold cursor-pointer hover:underline truncate max-w-[160px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] whitespace-nowrap overflow-hidden"
              onClick={() => router.push(`/youtube_videos/${video.id}`)}
              title={video.title}
            >
              {video.title}
            </h2>
          </div>
          <p className="text-xs text-gray-500">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">動画時間: {formatDuration(video.duration)}</p>
          {/* いいね数・ノート数表示 */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FavoriteIcon className="text-red-500" fontSize="small" />
            {video.likes_count}
            <NoteIcon className="text-blue-500" fontSize="small" />
            {video.notes_count}
          </div>

          {/* いいねボタンとツールチップ */}
          {currentUser && (
            <div className="relative group inline-block mt-1">
              <LikeButton liked={video.liked ?? false} onLikeClick={handleLikeClick} />
            </div>
          )}
        </div>
      </div>
    </div>


  );
};

export default PlaylistVideoCard;
