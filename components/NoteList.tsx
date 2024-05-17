import React from 'react';
import NoteItem from './NoteItem';
import { Note } from '../types/note';

interface NoteListProps {
  notes: Note[];
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: string;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, currentUser, videoTimestampToSeconds, playFromTimestamp, videoId, onDelete, onEdit }) => {
  // 受け取ったノートはすでに作成順にソートされている
  return (
    <div id="notes_list">
      <h2 style={{ marginTop: '20px' }}>メモ一覧</h2>
      {notes.length > 0 ? (
        <div className="flex flex-wrap">
          {notes.map((note) => (
            <div key={note.id} className="p-2 flex-1 lg:max-w-1/3">
              <NoteItem
                note={note}
                currentUser={currentUser}
                videoTimestampToSeconds={videoTimestampToSeconds}
                playFromTimestamp={playFromTimestamp}
                videoId={videoId}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      ) : (
        <p id="no_notes_message">メモがありません。</p>
      )}
    </div>
  );
};

export default NoteList;
