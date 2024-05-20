// YoutubeVideoDetails.tsx
import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo & { formattedDuration: string };
  handleLike: () => void;
  handleUnlike: () => void;
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
          <div className="flex justify-between items-center">
            <button
              onClick={liked ? handleUnlike : handleLike}
              className={`btn ${liked ? 'btn-danger' : 'btn-primary'}`}
            >
              {liked ? 'いいねを取り消す' : 'いいね'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDetails;
