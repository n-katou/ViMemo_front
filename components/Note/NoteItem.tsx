import React, { useState } from 'react';
import { Note } from '../../types/note';
import NoteContent from './NoteContent';
import NoteEditor from './NoteEditor';
import NoteActions from './NoteActions';

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

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete,
  onEdit,
  isOwner
}) => {
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
    playFromTimestamp(seconds);
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  if (!note.is_visible && !isOwner) {
    return null;
  }

  return (
    <div className="card mx-auto w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-3">
      <div className="card-body">
        {avatarUrl && <img src={avatarUrl} alt="User Avatar" width="100" height="100" />}
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
          <NoteEditor
            newContent={newContent}
            newMinutes={newMinutes}
            newSeconds={newSeconds}
            newIsVisible={newIsVisible}
            setNewContent={setNewContent}
            setNewMinutes={setNewMinutes}
            setNewSeconds={setNewSeconds}
            setNewIsVisible={setNewIsVisible}
            handleEdit={handleEdit}
            setIsEditing={setIsEditing}
            padZero={padZero}
          />
        ) : (
          <NoteContent note={note} />
        )}
        <p>いいね: {note.likes_count}</p>
        {!note.is_visible && isOwner && (
          <p><span className="badge badge-error">非表示中</span></p>
        )}
        <NoteActions
          note={note}
          currentUser={currentUser}
          videoId={videoId}
          newMinutes={newMinutes}
          newSeconds={newSeconds}
          videoTimestampToSeconds={videoTimestampToSeconds}
          handleDelete={handleDelete}
          setIsEditing={setIsEditing}
        />
      </div>
    </div>
  );
};

export default NoteItem;
