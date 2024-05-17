import React, { useState } from 'react';
import { Note } from '../../types/note';
import NoteContent from './NoteContent';
import NoteEditor from './NoteEditor';
import NoteActions from './NoteActions';
import Modal from './Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
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
    <div className="card mx-auto w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 rounded-lg overflow-hidden">
      <div className="card-body p-6">
        <div className="flex items-center mb-4">
          {avatarUrl && <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />}
          <div>
            <p className="text-xl font-bold">{note.user?.name || 'Unknown User'}</p>
            <button onClick={handleTimestampClick} className="text-blue-500 hover:underline">
              {padZero(newMinutes)}:{padZero(newSeconds)}
            </button>
          </div>
        </div>
        <NoteContent note={note} />
        <div className="mt-4">
          <p>いいね: {note.likes_count}</p>
          {!note.is_visible && isOwner && (
            <p><span className="badge badge-error">非表示中</span></p>
          )}
        </div>
        <NoteActions
          note={note}
          currentUser={currentUser}
          videoId={videoId}
          newMinutes={newMinutes}
          newSeconds={newSeconds}
          videoTimestampToSeconds={videoTimestampToSeconds}
          handleDelete={handleDelete}
          setIsEditing={() => setIsModalOpen(true)}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
      </Modal>
    </div>
  );
};

export default NoteItem;
