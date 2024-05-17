import React from 'react';
import { Note } from '../../types/note';

interface NoteActionsProps {
  note: Note;
  currentUser: any;
  videoId: string;
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
    <div className="card-actions">
      {note.youtube_video_id && (
        <button className="btn btn-outline btn-primary">
          いいね {/* いいねボタンの実装をここに追加 */}
        </button>
      )}
      {currentUser?.id === note.user?.id && (
        <>
          <a href={`https://x.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`【シェア】\nタイムスタンプ: ${padZero(newMinutes)}:${padZero(newSeconds)} \nメモ: ${note.content} \nYouTube: https://www.youtube.com/watch?v=${videoId}&t=${videoTimestampToSeconds(note.video_timestamp)}s`)}`} target="_blank" className="btn btn-outline btn-primary">
            Xでシェア
          </a>
          <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-info">
            編集
          </button>
          <button onClick={handleDelete} className="btn btn-outline btn-error">
            削除
          </button>
        </>
      )}
    </div>
  );
};

export default NoteActions;
