import React, { useState, useEffect } from 'react';
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

  // プレーヤーの準備完了を待つ関数
  const waitForPlayerReady = (maxRetries = 5, delay = 1000) => {
    return new Promise<void>((resolve, reject) => {
      let retries = 0;

      const checkReady = () => {
        if (player && player.getPlayerState) {
          if (player.getPlayerState() !== -1) { // プレーヤーが未初期化状態でない
            resolve();
          } else if (retries < maxRetries) {
            retries++;
            setTimeout(checkReady, delay);
          } else {
            reject('Player is not ready after maximum retries');
          }
        } else {
          reject('Player is not initialized');
        }
      };

      checkReady();
    });
  };

  // タイムスタンプを取得して編集ノートに設定する関数
  const handleSetTimestamp = async () => {
    try {
      await waitForPlayerReady();
      if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        setEditNote(prev => prev ? {
          ...prev,
          video_timestamp: `${minutes}:${seconds}`
        } : prev);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setTimestamp={handleSetTimestamp}
        player={player}
      />
    </Modal>
  );
};

export default EditNoteModal;
