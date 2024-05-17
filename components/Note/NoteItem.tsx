import React, { useState } from 'react';
import { Note } from '../../types/note';

interface NoteItemProps {
  note: Note;
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: string;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void;
  isOwner: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, currentUser, videoTimestampToSeconds, playFromTimestamp, videoId, onDelete, onEdit, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(note.content);
  const [newMinutes, setNewMinutes] = useState(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
  const [newSeconds, setNewSeconds] = useState(videoTimestampToSeconds(note.video_timestamp) % 60);
  const [newIsVisible, setNewIsVisible] = useState(note.is_visible);
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl;

  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  const handleEdit = () => {
    onEdit(note.id, newContent, newMinutes, newSeconds, newIsVisible);
    setIsEditing(false);
  };

  const handleTimestampClick = () => {
    const seconds = videoTimestampToSeconds(note.video_timestamp);
    console.log('Timestamp clicked:', note.video_timestamp);
    console.log('Converted to seconds:', seconds);
    playFromTimestamp(seconds);
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  // 投稿主でない場合、非表示のメモを表示しない
  if (!note.is_visible && !isOwner) {
    return null;
  }

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
            onClick={handleTimestampClick}
            className="btn btn-outline link-hover"
          >
            {padZero(newMinutes)}:{padZero(newSeconds)}
          </button>
        </p>
        {isEditing ? (
          <div>
            <div className="form-control mb-4">
              <label className="label">
                <span>タイムスタンプ:</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    value={padZero(newMinutes)}
                    onChange={(e) => setNewMinutes(parseInt(e.target.value, 10))}
                    min="0"
                    max="59"
                    className="input input-bordered"
                  />
                  分
                  <input
                    type="number"
                    value={padZero(newSeconds)}
                    onChange={(e) => setNewSeconds(parseInt(e.target.value, 10))}
                    min="0"
                    max="59"
                    className="input input-bordered"
                  />
                  秒
                </div>
              </label>
            </div>
            <div className="form-control mb-4">
              <label className="label">メモ</label>
              <textarea
                className="textarea textarea-bordered"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">表示</label>
              <select
                value={newIsVisible ? 'true' : 'false'}
                onChange={(e) => setNewIsVisible(e.target.value === 'true')}
                className="select select-bordered"
              >
                <option value="true">表示する</option>
                <option value="false">表示しない</option>
              </select>
            </div>
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
        {!note.is_visible && isOwner && (
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
      </div>
    </div>
  );
};

export default NoteItem;
