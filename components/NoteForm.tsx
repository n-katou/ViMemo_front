import React, { useState } from 'react';

type NoteFormProps = {
  addNote: (content: string, minutes: number, seconds: number, isVisible: boolean) => Promise<void>;
};

const NoteForm: React.FC<NoteFormProps> = ({ addNote }) => {
  const [noteContent, setNoteContent] = useState('');
  const [timestampMinutes, setTimestampMinutes] = useState(0);
  const [timestampSeconds, setTimestampSeconds] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNote(noteContent, timestampMinutes, timestampSeconds, isVisible);
    setNoteContent('');
    setTimestampMinutes(0);
    setTimestampSeconds(0);
    setIsVisible(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="メモを入力..."
        required
        className="textarea textarea-bordered"
      />
      <div className="form-control mb-4">
        <label className="label">
          <span>タイムスタンプ:</span>
          <div className="flex gap-2">
            <input
              type="number"
              value={timestampMinutes}
              onChange={(e) => setTimestampMinutes(parseInt(e.target.value, 10))}
              min="0"
              max="59"
              className="input input-bordered"
            />
            分
            <input
              type="number"
              value={timestampSeconds}
              onChange={(e) => setTimestampSeconds(parseInt(e.target.value, 10))}
              min="0"
              max="59"
              className="input input-bordered"
            />
            秒
          </div>
        </label>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span>表示:</span>
          <select
            value={isVisible ? 'true' : 'false'}
            onChange={(e) => setIsVisible(e.target.value === 'true')}
            className="select select-bordered"
          >
            <option value="true">表示する</option>
            <option value="false">表示しない</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-primary">メモを追加</button>
    </form>
  );
};

export default NoteForm;
