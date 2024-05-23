import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo & { formattedDuration: string };
  handleLike?: () => void; // Optional
  handleUnlike?: () => void; // Optional
  currentUser: any;
  liked: boolean;
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({ video, handleLike, handleUnlike, currentUser, liked }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="video-wrapper">
        <iframe
          className="w-full aspect-video"
          id="youtube-video"
          data-video-id={video.youtube_id}
          src={`https://www.youtube.com/embed/${video.youtube_id}?playsinline=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
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
