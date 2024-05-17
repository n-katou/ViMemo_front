import React from 'react';
import NoteItem from './NoteItem';
import { Note } from '../types/note';

interface NoteListProps {
  notes: Note[];
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: string;
  onDelete: (noteId: number) => void; // onDeleteプロパティを追加
  onEdit: (noteId: number, newContent: string) => void; // onEditプロパティを追加
}

const NoteList: React.FC<NoteListProps> = ({ notes, currentUser, videoTimestampToSeconds, playFromTimestamp, videoId, onDelete, onEdit }) => {
  // メモを作成日時でソートする
  const sortedNotes = [...notes].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div id="notes_list">
      <h2 style={{ marginTop: '20px' }}>メモ一覧</h2>
      {sortedNotes.length > 0 ? (
        <div className="flex flex-wrap">
          {sortedNotes.map((note) => (
            <div key={note.id} className="p-2 flex-1 lg:max-w-1/3">
              <NoteItem
                note={note}
                currentUser={currentUser}
                videoTimestampToSeconds={videoTimestampToSeconds}
                playFromTimestamp={playFromTimestamp}
                videoId={videoId}
                onDelete={onDelete} // onDeleteを渡す
                onEdit={onEdit} // onEditを渡す
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
