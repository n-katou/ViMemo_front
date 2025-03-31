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

  return (
    <div
      ref={dragDropRef}
      className="bg-white shadow-lg rounded-lg overflow-hidden youtube-video-card group"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white',
        transition: 'background-color 0.2s, transform 0.2s',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        zIndex: isDragging ? 1000 : 'auto',
      }}
    >
      <div className="drag-handle cursor-move bg-gradient-rainbow p-2 flex items-center justify-center">
        <MdDragIndicator className="text-white mr-2" />
        <p className="text-white text-sm">ドラッグして順番を変更</p>
      </div>
      <VideoContainer className="hidden md:block relative w-full h-0 pb-[56.25%]">
        <img
          src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
          alt="YouTubeサムネイル"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </VideoContainer>
      <CardContentBox>
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-bold text-blue-600 cursor-pointer hover:underline group-hover:text-blue-700 truncate"
            onClick={() => router.push(`/youtube_videos/${video.id}`)}
            style={{ maxWidth: '70%' }}
            title={video.title}
          >
            {video.title}
          </h2>
        </div>
        <div className="hidden md:block">
          <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
          <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
          <div className="flex items-center">
            <FavoriteIcon className="text-red-500 mr-1" />
            <p className="text-gray-600">{video.likes_count}</p>
          </div>
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
        </div>
        <LikeButtonContainer className="block md:block mt-2">
          <LikeButton liked={video.liked ?? false} onLikeClick={handleLikeClick} />
        </LikeButtonContainer>
      </CardContentBox>
    </div>
  );
};

export default FavoriteVideoCard;
