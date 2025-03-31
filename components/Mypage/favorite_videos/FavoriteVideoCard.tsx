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
      className="relative mb-1 pb-2 pt-0 px-0 border border-gray-200 rounded-md shadow-sm bg-white overflow-hidden"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white',
      }}
    >
      {/* ドラッグハンドル */}
      <div className="w-full h-5 bg-gradient-rainbow flex items-center justify-center cursor-move mb-2">
        <MdDragIndicator className="text-white" size={14} />
      </div>
      {/* メインコンテンツ横並び */}
      <div className="flex flex-col md:flex-col items-start gap-2 md:items-start">
        <div className="flex flex-row md:flex-col items-start gap-2 w-full">
          {/* サムネイル */}
          <img
            src={thumbnailUrl}
            alt={`thumbnail-${video.id}`}
            className="w-24 h-16 rounded-md object-cover flex-shrink-0"
          />
          {/* タイトル（サムネイルの右側） */}
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-sm font-medium">{index + 1}.</span>
            <h2
              className="text-blue-600 font-semibold text-sm cursor-pointer hover:underline truncate"
              onClick={() => router.push(`/youtube_videos/${video.id}`)}
              title={video.title}
            >
              {video.title}
            </h2>
          </div>
          {/* メタ情報 */}
          <div className="w-full text-xs text-gray-600 space-y-1 hidden md:block">
            <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
            <p>動画時間: {formatDuration(video.duration)}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <FavoriteIcon className="text-red-500 mr-1" fontSize="small" /> {video.likes_count}
              <span
                className="flex items-center flex-shrink-0 overflow-hidden"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <NoteIcon className="text-blue-500 mr-1" fontSize="small" />
                <span className="truncate max-w-[24px]">{video.notes_count}</span>
                <SearchIcon className="ml-1" fontSize="small" />
              </span>
            </div>
          </div>
        </div>
        <div className="text-[10px]">
          <LikeButton liked={video.liked ?? false} onLikeClick={handleLikeClick} />
        </div>
      </div>

      <VideoPopover
        open={open}
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
        relatedNotes={relatedNotes}
        playerRef={playerRef}
      />
    </div >

  );
};

export default FavoriteVideoCard;
