import React from 'react';
import { Note } from '../../types/note';
import { BsTwitterX } from "react-icons/bs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface NoteActionsProps {
  note: Note;
  currentUser: any;
  videoId: number;
  newMinutes: number;
  newSeconds: number;
  videoTimestampToSeconds: (timestamp: string) => number;
  handleDelete: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  currentUser,
  newMinutes,
  newSeconds,
  videoTimestampToSeconds,
  handleDelete,
  setIsEditing
}) => {
  const padZero = (num: number) => num.toString().padStart(2, '0');
  const youtubeId = note.youtube_video?.youtube_id;

  // インパクトのあるシェアメッセージ
  const shareMessage = `【シェア】\n\n🔖タイムスタンプ: ${padZero(newMinutes)}:${padZero(newSeconds)}\n📝メモ: ${note.content}\n📺YouTube: https://www.youtube.com/watch?v=${youtubeId}&t=${videoTimestampToSeconds(note.video_timestamp)}s\n\nViMemoでシェアしよう✍️`;

  const shareUrl = youtubeId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareMessage)}` : '';

  return (
    <div className="card-actions mt-4 flex space-x-4">
      {currentUser?.id === note.user?.id && (
        <>
          {youtubeId ? (
            <IconButton
              href={shareUrl}
              target="_blank"
              className="btn btn-outline btn-primary share-button"
            >
              <BsTwitterX />
            </IconButton>
          ) : (
            <p>YouTube IDが見つかりません</p>
          )}
          <IconButton onClick={() => setIsEditing(true)} className="btn btn-outline btn-info edit-button">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} className="btn btn-outline btn-error delete-button">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default NoteActions;
