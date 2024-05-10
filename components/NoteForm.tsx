import React, { useState, FormEvent } from 'react';

interface NoteFormProps {
  addNote: (note: string) => Promise<void>;
}

const NoteForm: React.FC<NoteFormProps> = ({ addNote }) => {
  const [note, setNote] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (note.trim()) {
      addNote(note)
        .then(() => setNote(""))  // フォームをリセット
        .catch(err => console.error("Error submitting the note: ", err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="メモを入力..."
        rows={4}
        cols={50}
      />
      <button type="submit">メモを追加</button>
    </form>
  );
};

export default NoteForm;
