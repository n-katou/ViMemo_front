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

  const incrementMinutes = () => {
    setTimestampMinutes((prev) => (prev < 59 ? prev + 1 : prev));
  };

  const decrementMinutes = () => {
    setTimestampMinutes((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const incrementSeconds = () => {
    if (timestampSeconds < 59) {
      setTimestampSeconds((prev) => prev + 1);
    } else {
      setTimestampSeconds(0);
      setTimestampMinutes((prev) => prev < 59 ? prev + 1 : prev);
    }
  };

  const decrementSeconds = () => {
    if (timestampSeconds > 0) {
      setTimestampSeconds((prev) => prev - 1);
    } else if (timestampMinutes > 0) {
      setTimestampSeconds(59);
      setTimestampMinutes((prev) => prev - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-md">
      <div className="form-control">
        <label className="label font-semibold text-gray-700">メモを入力:</label>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="メモを入力..."
          required
          className="textarea textarea-bordered h-32 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-gray-700">タイムスタンプ:</label>
        <div className="flex gap-2 items-center flex-wrap">
          <button type="button" onClick={incrementMinutes} className="btn btn-outline">+</button>
          <input
            type="text"
            value={timestampMinutes}
            readOnly
            className="input input-bordered text-center"
            style={{ width: '50px' }}
          />
          分
          <button type="button" onClick={decrementMinutes} className="btn btn-outline">-</button>
          <button type="button" onClick={incrementSeconds} className="btn btn-outline">+</button>
          <input
            type="text"
            value={timestampSeconds}
            readOnly
            className="input input-bordered text-center"
            style={{ width: '50px' }}
          />
          秒
          <button type="button" onClick={decrementSeconds} className="btn btn-outline">-</button>
        </div>
      </div>
      <div className="form-control">
        <label className="label font-semibold text-gray-700">表示:</label>
        <select
          value={isVisible ? 'true' : 'false'}
          onChange={(e) => setIsVisible(e.target.value === 'true')}
          className="select select-bordered p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">表示する</option>
          <option value="false">表示しない</option>
        </select>
      </div>
      <div className="form-control">
        <button type="submit" className="btn btn-primary w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
          メモを追加
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
