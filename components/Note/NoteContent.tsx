import React from 'react';
import { Note } from '../../types/note';

const NoteContent: React.FC<{ note: Note }> = ({ note }) => (
  <p>
    <span className="font-bold">メモ:</span>
    {note.content}
  </p>
);

export default NoteContent;
