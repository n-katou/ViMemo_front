import React from 'react';
import { Note } from '../../types/note';
import NoteIcon from '@mui/icons-material/Note';

// NoteContentコンポーネントを定義
const NoteContent: React.FC<{ note: Note }> = ({ note }) => (
  <div className="note-card-normal bg-gray-100 p-4 rounded-lg shadow-md">
    {/* メモのヘッダー部分 */}
    <div className="note-header flex items-center mb-2">
      <NoteIcon className="text-blue-500 mr-2" />
      <span className="font-bold text-lg">メモ</span>
    </div>
    {/* メモの内容部分 */}
    <div className="note-content-normal text-gray-800">
      {note.content}
    </div>
  </div>
);

export default NoteContent;
