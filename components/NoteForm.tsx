import React, { useState } from 'react';

type NoteFormProps = {
  addNote: (content: string, minutes: number, seconds: number) => Promise<void>;
};

const NoteForm: React.FC<NoteFormProps> = ({ addNote }) => {
  const [noteContent, setNoteContent] = useState('');
  const [timestampMinutes, setTimestampMinutes] = useState(0);
  const [timestampSeconds, setTimestampSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNote(noteContent, timestampMinutes, timestampSeconds);
    setNoteContent('');
    setTimestampMinutes(0);
    setTimestampSeconds(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="メモを入力..."
        required
      />
      <div>
        <label>
          <input
            type="number"
            value={timestampMinutes}
            onChange={(e) => setTimestampMinutes(parseInt(e.target.value, 10))}
          />
          分
        </label>
        <label>
          <input
            type="number"
            value={timestampSeconds}
            onChange={(e) => setTimestampSeconds(parseInt(e.target.value, 10))}
          />
          秒
        </label>
      </div>
      <button type="submit">メモを追加</button>
    </form>
  );
};

export default NoteForm;
