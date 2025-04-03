import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Badge from '@mui/material/Badge';
import { Avatar, Tooltip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

import { Note } from '../../../types/note';
import { Like } from '../../../types/like';

import { useAuth } from '../../../context/AuthContext';

import NoteContent from './NoteContent';
import NoteActions from './NoteActions';
import { handleLikeNote, handleUnlikeNote, padZero } from './noteItemFunctions';

interface NoteItemProps {
  note: Note;
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: number;
  onDelete?: (noteId: number) => void;
  onEditClick: (note: Note) => void;
  isOwner: boolean;
  index: number;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete = () => { },
  onEditClick,
  isOwner,
  index,
  moveNote,
}) => {
  const { jwtToken } = useAuth();
  const [liked, setLiked] = useState<boolean>(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl;
  const ref = useRef<HTMLDivElement>(null);

  const ownerBgColor = '#38bdf8';
  const otherUserBgColor = '#e879f9';
  const dragBgColor = '#22eec5';
  const bgColor = isOwner ? ownerBgColor : otherUserBgColor;

  useEffect(() => {
    if (note.likes) {
      setLiked(note.likes.some((like: Like) => like.user_id === Number(currentUser?.id)));
    }
    setIsInitialized(true);
  }, [note, currentUser]);

  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  const handleTimestampClick = () => {
    playFromTimestamp(videoTimestampToSeconds(note.video_timestamp));
  };

  const [, drop] = useDrop({
    accept: 'note',
    hover: (draggedItem: { index: number }, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveNote(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    canDrag: isOwner,
  });

  if (isOwner) drag(drop(ref));
  else drop(ref);

  if (!note.is_visible && !isOwner) return null;

  const newMinutes = Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60);
  const newSeconds = videoTimestampToSeconds(note.video_timestamp) % 60;

  return (
    <motion.div
      ref={ref}
      className="note-item border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6 h-[380px]"
      style={{
        backgroundColor: isDragging ? dragBgColor : bgColor,
        opacity: isDragging ? 0.8 : 1,
        cursor: isOwner ? 'grab' : 'default',
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
        border: isDragging ? '2px dashed #22eec5' : 'none',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <motion.div className="p-6 text-black h-full flex flex-col justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex text-white items-center">
              {avatarUrl && <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 48, height: 48, mr: 2 }} />}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xl font-bold break-words max-w-[160px]">{note.user?.name || 'Unknown User'}</p>
                <button onClick={handleTimestampClick} className="text-blue-700 hover:underline">
                  タイムスタンプ:{padZero(newMinutes)}:{padZero(newSeconds)}
                </button>
                <p className="text-white text-sm whitespace-nowrap">{new Date(note.created_at).toLocaleString()}</p>
              </motion.div>
            </div>
            {isOwner && (
              <Tooltip title="ドラッグして並び替え">
                <div className="text-white cursor-move">
                  <DragIndicatorIcon />
                </div>
              </Tooltip>
            )}
          </div>
          <div className="overflow-y-auto mb-1 h-[160px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded">
            <NoteContent note={note} />
          </div>
        </div>
        {isOwner && !note.is_visible && <div className="text-yellow-400 text-sm mt-1">非表示中</div>}
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col items-center">
            {isInitialized && (
              <Tooltip title={liked ? 'いいねを取り消す' : 'いいね'}>
                <motion.div initial={{ scale: 1 }} animate={{ scale: 1 }} transition={{ duration: 0 }}>
                  <IconButton onClick={liked ? () => handleUnlikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError) : () => handleLikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError)}>
                    <Badge badgeContent={note.likes_count} color="primary">
                      {liked ? <ThumbUpIcon style={{ color: 'white' }} /> : <ThumbUpOffAltIcon style={{ color: 'white' }} />}
                    </Badge>
                  </IconButton>
                </motion.div>
              </Tooltip>
            )}
          </div>
          {isOwner && (
            <NoteActions
              note={note}
              currentUser={currentUser}
              videoId={videoId}
              handleDelete={handleDelete}
              setIsEditing={() => onEditClick(note)}
              newMinutes={newMinutes}
              newSeconds={newSeconds}
              videoTimestampToSeconds={videoTimestampToSeconds}
            />
          )}
        </div>
        {likeError && <div className="p-4 text-red-500">{likeError}</div>}
      </motion.div>
    </motion.div>
  );
};

export default NoteItem;
