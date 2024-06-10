import React from 'react';
import Modal from '../Modal';
import NoteEditor from '../Item/NoteEditor';
import { Note } from '../../../types/note';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editNote: Note | null;
  setEditNote: React.Dispatch<React.SetStateAction<Note | null>>;
  videoTimestampToSeconds: (timestamp: string) => number;
  handleEditSubmit: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void;
  player: any;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isOpen,
  onClose,
  editNote,
  setEditNote,
  videoTimestampToSeconds,
  handleEditSubmit,
  player
}) => {
  if (!editNote) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <NoteEditor
        newContent={editNote.content}
        newMinutes={Math.floor(videoTimestampToSeconds(editNote.video_timestamp) / 60)}
        newSeconds={videoTimestampToSeconds(editNote.video_timestamp) % 60}
        newIsVisible={editNote.is_visible}
        setNewContent={(value) => setEditNote(prev => prev ? { ...prev, content: value } : prev)}
        setNewMinutes={(value) => setEditNote(prev => {
          const [_, seconds] = editNote.video_timestamp.split(':').map(Number);
          return prev ? { ...prev, video_timestamp: `${value}:${seconds}` } : prev;
        })}
        setNewSeconds={(value) => setEditNote(prev => {
          const [minutes, _] = editNote.video_timestamp.split(':').map(Number);
          return prev ? { ...prev, video_timestamp: `${minutes}:${value}` } : prev;
        })}
        setNewIsVisible={(value) => setEditNote(prev => prev ? { ...prev, is_visible: value } : prev)}
        handleEdit={() => handleEditSubmit(editNote.id, editNote.content, Math.floor(videoTimestampToSeconds(editNote.video_timestamp) / 60), videoTimestampToSeconds(editNote.video_timestamp) % 60, editNote.is_visible)}
        setIsEditing={(value) => onClose()}
        padZero={(num) => num.toString().padStart(2, '0')}
        setTimestamp={() => {
          if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            setEditNote(prev => prev ? {
              ...prev,
              video_timestamp: `${minutes}:${seconds}`
            } : prev);
          }
        }}
        player={player}
      />
    </Modal>
  );
};

export default EditNoteModal;
