import React, { useState, useEffect, useRef } from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import YouTube from 'react-youtube';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo & { formattedDuration: string };
  handleLike?: () => void; // Optional
  handleUnlike?: () => void; // Optional
  currentUser: any;
  liked: boolean;
  onPlayerReady: (player: any) => void;
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({ video, handleLike, handleUnlike, currentUser, liked, onPlayerReady }) => {
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [player, setPlayer] = useState<any>(null);

  const handlePlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const player = event.target;
      setPlayer(player);
      onPlayerReady(player);
    }
  };

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(formatTime(time));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="relative video-wrapper">
        <YouTube
          videoId={video.youtube_id}
          opts={{ playerVars: { playsinline: 1 } }}
          onStateChange={handlePlayerStateChange}
          className="w-full aspect-video"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
          {currentTime} / {video.formattedDuration}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
        <p className="text-gray-600 mb-4">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p className="text-gray-600 mb-4">動画時間: {video.formattedDuration}</p>
        {currentUser && (
          <div className="flex items-center">
            <IconButton
              onClick={liked ? handleUnlike : handleLike}
              color={liked ? 'secondary' : 'default'}
              aria-label={liked ? 'Unlike' : 'Like'}
              sx={{
                borderRadius: '50%',
                backgroundColor: liked ? '#ffebee' : 'transparent',
                '&:hover': {
                  backgroundColor: liked ? '#ffcdd2' : '#f5f5f5',
                },
                transition: 'background-color 0.3s',
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <span className="ml-2 text-lg font-medium text-gray-700">
              {liked ? 'いいね済み' : 'いいねする'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDetails;
