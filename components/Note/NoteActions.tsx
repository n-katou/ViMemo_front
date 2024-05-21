import React from 'react';
import { Note } from '../../types/note';
import { BsTwitterX } from "react-icons/bs"; // Font AwesomeのTwitterアイコン
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
  videoId,
  newMinutes,
  newSeconds,
  videoTimestampToSeconds,
  handleDelete,
  setIsEditing
}) => {
  const padZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="card-actions mt-4 flex space-x-4">
      {currentUser?.id === note.user?.id && (
        <>
          <IconButton
            href={`https://x.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`【シェア】\nタイムスタンプ: ${padZero(newMinutes)}:${padZero(newSeconds)} \nメモ: ${note.content} \nYouTube: https://www.youtube.com/watch?v=${videoId}&t=${videoTimestampToSeconds(note.video_timestamp)}s`)}`}
            target="_blank"
            className="btn btn-outline btn-primary"
          >
            <BsTwitterX />
          </IconButton>
          <IconButton onClick={() => setIsEditing(true)} className="btn btn-outline btn-info">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} className="btn btn-outline btn-error">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default NoteActions;
