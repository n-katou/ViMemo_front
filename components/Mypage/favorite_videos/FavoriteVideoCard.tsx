import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { Note } from '../../../types/note';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import NoteIcon from '@mui/icons-material/Note';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import useNotePopover from '../../../hooks/mypage/favorite_videos/useNotePopover';
import { VideoContainer, CardContentBox, LikeButtonContainer } from '../../../styles/mypage/favorite_videos/FavoriteVideoCardStyles';
import LikeButton from './LikeButton';
import VideoPopover from './VideoPopover';
import { formatDuration } from '../../YoutubeShow/youtubeShowUtils';
import { MdDragIndicator } from 'react-icons/md';

interface VideoCardProps {
  video: YoutubeVideo;
  currentUser: any;
  handleLikeVideo: (id: number) => void;
  handleUnlikeVideo: (id: number, likeId: number | undefined) => void;
  notes?: Note[];
  index: number;
  moveVideo: (dragIndex: number, hoverIndex: number) => void;
}

const FavoriteVideoCard: React.FC<VideoCardProps> = ({
  video,
  currentUser,
  handleLikeVideo,
  handleUnlikeVideo,
  notes = [],
  index,
  moveVideo,
}) => {
  const router = useRouter();
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  const { dragDropRef, isDragging, isOver } = useDragDropVideoCard(index, moveVideo);
  const { anchorEl, open, handlePopoverOpen, handlePopoverClose } = useNotePopover();

  const relatedNotes = notes.filter(note => note.youtube_video_id === video.id);

  const handleLikeClick = async () => {
    if (video.liked && currentUser && video.likeId) {
      await handleUnlikeVideo(video.id, video.likeId);
    } else {
      await handleLikeVideo(video.id);
    }
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

  return (
    <div
      ref={dragDropRef}
      className="mb-3"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white',
        padding: '10px 14px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="drag-handle cursor-move bg-gradient-rainbow p-2 flex items-center justify-center">
        <MdDragIndicator className="text-white-400" size={20} />
      </div>
      <span style={{ width: '20px', textAlign: 'right', fontWeight: 'bold' }}>{index + 1}.</span>
      <img
        src={thumbnailUrl}
        alt={`thumbnail-${video.id}`}
        style={{
          width: '64px',
          height: '36px',
          borderRadius: '4px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline group-hover:text-blue-700 truncate"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
          style={{ maxWidth: '70%' }}
          title={video.title}
        >
          {video.title}
        </h2>
        <div className="flex items-center text-xs text-gray-600 gap-4 mt-1">
          <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
          <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
          <span className="flex items-center">
            <FavoriteIcon className="text-red-500 mr-1" />
            <p className="text-gray-600">{video.likes_count}</p>
          </span>
          <div className="flex items-center" onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
            <NoteIcon className="text-blue-500 mr-1" />
            <p className="text-gray-600 flex items-center">
              {video.notes_count} <SearchIcon className="ml-1" />
            </p>
          </div>
          <VideoPopover
            open={open}
            anchorEl={anchorEl}
            handlePopoverClose={handlePopoverClose}
            relatedNotes={relatedNotes}
            playerRef={playerRef}
          />
          <LikeButtonContainer className="block md:block mt-2">
            <LikeButton liked={video.liked ?? false} onLikeClick={handleLikeClick} />
          </LikeButtonContainer>
        </div>
      </div>
    </div>
  );
};

export default FavoriteVideoCard;
