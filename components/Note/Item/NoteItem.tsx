import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../../../types/note';
import { Like } from '../../../types/like';
import { useAuth } from '../../../context/AuthContext';
import NoteContent from './NoteContent';
import NoteActions from './NoteActions';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Badge from '@mui/material/Badge';
import { Avatar, Tooltip, IconButton } from '@mui/material';
import { handleLikeNote, handleUnlikeNote, padZero } from './noteItemFunctions';
import { motion } from 'framer-motion';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

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

  // 背景色を設定
  const ownerBgColor = '#38bdf8';
  const otherUserBgColor = '#e879f9';
  const dragBgColor = '#22eec5'; // ドラッグ中の背景色
  const bgColor = isOwner ? ownerBgColor : otherUserBgColor;

  useEffect(() => {
    if (note.likes) {
      setLiked(note.likes.some((like: Like) => like.user_id === Number(currentUser?.id)));
    }
    setIsInitialized(true); // 初期化が完了したことを設定
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
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveNote(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isOwner, // 所有者のみドラッグ可能にする
  });

  if (isOwner) {
    drag(drop(ref));
  } else {
    drop(ref);
  }

  if (!note.is_visible && !isOwner) {
    return null;
  }

  const newMinutes = Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60);
  const newSeconds = videoTimestampToSeconds(note.video_timestamp) % 60;

  return (
    <motion.div
      ref={ref}
      className="note-item fixed-card-size border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6"
      style={{
        backgroundColor: isDragging ? dragBgColor : bgColor,
        opacity: isDragging ? 0.8 : 1,
        cursor: isOwner ? 'grab' : 'default', // カーソルを変更
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none', // ドラッグ中の影
        border: isDragging ? '2px dashed #22eec5' : 'none', // ドラッグ中のボーダー
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <motion.div className="p-6 text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex text-white items-center mb-4">
          {avatarUrl && <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 48, height: 48, mr: 2 }} />}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xl font-bold">{note.user?.name || 'Unknown User'}</p>
            <button onClick={handleTimestampClick} className="text-blue-700 hover:underline">
              タイムスタンプ:{padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
            </button>
            <p className="text-white text-sm">{new Date(note.created_at).toLocaleString()}</p>
          </motion.div>
        </div>
        <div className="h-40 overflow-y-auto mb-1">
          <NoteContent note={note} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isInitialized && ( // 初期化が完了した後にのみ表示
              <Tooltip title={liked ? "いいねを取り消す" : "いいね"}>
                <motion.div initial={{ scale: 1 }} animate={{ scale: 1 }} transition={{ duration: 0 }}>
                  <IconButton onClick={liked ? () => handleUnlikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError) : () => handleLikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError)}>
                    <Badge badgeContent={note.likes_count} color="primary">
                      {liked ? <ThumbUpIcon style={{ color: 'white' }} /> : <ThumbUpOffAltIcon style={{ color: 'white' }} />}
                    </Badge>
                  </IconButton>
                </motion.div>
              </Tooltip>
            )}
            {!note.is_visible && isOwner && (
              <p className="text-yellow-400 ml-2">非表示中</p>
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
      </motion.div>
      {likeError && <div className="p-4 text-red-500">{likeError}</div>}
    </motion.div>
  );
};

export default NoteItem;
