import React from 'react';
import { Note } from '../../types/note';
import { BsTwitterX } from "react-icons/bs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface NoteActionsProps {
  note: Note;
  currentUser: any;
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

  // デバッグ用のログ
  console.log('Note:', note);
  console.log('YouTube Video:', note.youtube_video);
  console.log('YouTube ID:', youtubeId);

  const shareUrl = youtubeId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`【シェア】\nタイムスタンプ: ${padZero(newMinutes)}:${padZero(newSeconds)} \nメモ: ${note.content} \nYouTube: https://www.youtube.com/watch?v=${youtubeId}&t=${videoTimestampToSeconds(note.video_timestamp)}s \n`)}` : '';

  return (
    <div className="card-actions mt-4 flex space-x-4">
      {currentUser?.id === note.user?.id && (
        <>
          {youtubeId ? (
            <IconButton
              href={shareUrl}
              target="_blank"
              className="btn btn-outline btn-primary"
            >
              <BsTwitterX />
            </IconButton>
          ) : (
            <p>YouTube IDが見つかりません</p>
          )}
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
