import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { Note } from '../../../types/note';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import NoteIcon from '@mui/icons-material/Note';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import useNotePopover from '../../../hooks/mypage/favorite_videos/useNotePopover';
import { formatDuration } from '../../YoutubeShow/youtubeShowUtils';
import { MdDragIndicator } from 'react-icons/md';
import LikeButton from './LikeButton';
import VideoPopover from './VideoPopover';

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
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

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
      className="mb-3 p-4 border border-gray-200 rounded-md shadow-sm flex items-start gap-4 bg-white transition-all"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white',
      }}
    >
      {/* ドラッグハンドル */}
      <div className="flex items-center justify-center w-8 h-full bg-gradient-rainbow rounded-md">
        <MdDragIndicator className="text-white cursor-move" size={20} />
      </div>
      {/* サムネイル */}
      <img
        src={thumbnailUrl}
        alt={`thumbnail-${video.id}`}
        className="w-24 h-14 rounded-md object-cover flex-shrink-0"
      />

      {/* メイン情報 */}
      <div className="flex-1 min-w-0">
        {/* タイトル */}
        <h2
          className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline truncate flex items-center gap-1"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
          title={video.title}
        >
          <span className="text-gray-500">{index + 1}.</span>
          {video.title}
        </h2>

        {/* メタ情報 */}
        <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>公開日: {new Date(video.published_at).toLocaleDateString()}</span>
          <span>動画時間: {formatDuration(video.duration)}</span>
          <span className="flex items-center">
            <FavoriteIcon className="text-red-500 mr-1" fontSize="small" />
            {video.likes_count}
          </span>
          <span
            className="flex items-center"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <NoteIcon className="text-blue-500 mr-1" fontSize="small" />
            {video.notes_count}
            <SearchIcon className="ml-1" fontSize="small" />
          </span>
        </div>

        <VideoPopover
          open={open}
          anchorEl={anchorEl}
          handlePopoverClose={handlePopoverClose}
          relatedNotes={relatedNotes}
          playerRef={playerRef}
        />
      </div>

      {/* Likeボタン */}
      <div className="pl-2 pt-1">
        <LikeButton liked={video.liked ?? false} onLikeClick={handleLikeClick} />
      </div>
    </div>
  );
};

export default FavoriteVideoCard;
