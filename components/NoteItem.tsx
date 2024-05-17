import React, { useState } from 'react';
import { Note } from '../types/note';

interface NoteItemProps {
  note: Note;
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: string;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, currentUser, videoTimestampToSeconds, playFromTimestamp, videoId, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(note.content);
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl;

  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  const handleEdit = () => {
    onEdit(note.id, newContent);
    setIsEditing(false);
  };

  return (
    <div className="card mx-auto w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-3">
      <div className="card-body">
        {avatarUrl ? (
          <img src={avatarUrl} alt="User Avatar" width="100" height="100" />
        ) : (
          <div>No Avatar</div>
        )}
        <p>
          <span className="font-bold">ユーザー名:</span>
          {note.user?.name || 'Unknown User'}
        </p>
        <p>
          <span className="font-bold">タイムスタンプ:</span>
          <button
            onClick={() => playFromTimestamp(videoTimestampToSeconds(note.video_timestamp))}
            className="btn btn-outline link-hover"
          >
            {note.video_timestamp}
          </button>
        </p>
        {isEditing ? (
          <div>
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
            <button onClick={handleEdit} className="btn btn-outline btn-success">保存</button>
            <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-secondary">キャンセル</button>
          </div>
        ) : (
          <p>
            <span className="font-bold">メモ:</span>
            {note.content}
          </p>
        )}
        <p>
          いいね: {note.likes_count}
        </p>
        {!note.is_visible && (
          <p><span className="badge badge-error">非表示中</span></p>
        )}
        <div className="card-actions">
          {note.youtube_video_id && (
            <button className="btn btn-outline btn-primary">
              いいね {/* いいねボタンの実装をここに追加 */}
            </button>
          )}
          {currentUser?.id === note.user?.id && (
            <>
              <a href={`https://x.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`【シェア】\nタイムスタンプ: ${note.video_timestamp} \nメモ: ${note.content} \nYouTube: https://www.youtube.com/watch?v=${videoId}&t=${videoTimestampToSeconds(note.video_timestamp)}s`)}`} target="_blank" className="btn btn-outline btn-primary">
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
      </div>
    </div>
  );
};

export default NoteItem;
