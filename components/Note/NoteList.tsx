import React from 'react';
import NoteItem from './NoteItem';
import { Note } from '../../types/note';

interface NoteListProps {
  notes: Note[];
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: number;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, currentUser, videoTimestampToSeconds, playFromTimestamp, videoId, onDelete, onEdit }) => {
  return (
    <div id="notes_list" className="mt-5">
      <h2 className="text-xl font-bold mb-4">メモ一覧</h2>
      {notes.length > 0 ? (
        <div className="flex flex-wrap -mx-2">
          {notes.map((note) => {
            const isOwner = currentUser?.id === note.user?.id;
            return (
              <div key={note.id} className="p-2 w-full sm:w-1/2 lg:w-1/3">
                <NoteItem
                  note={note}
                  currentUser={currentUser}
                  videoTimestampToSeconds={videoTimestampToSeconds}
                  playFromTimestamp={playFromTimestamp}
                  videoId={videoId}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isOwner={isOwner}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p id="no_notes_message">メモがありません。</p>
      )}
    </div>
  );
};

export default NoteList;
