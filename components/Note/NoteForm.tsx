import React, { useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import Modal from './Modal'; // モーダルコンポーネントのインポート
import { FaPlus } from 'react-icons/fa'; // アイコンのインポート

type NoteFormProps = {
  addNote: (content: string, minutes: number, seconds: number, isVisible: boolean) => Promise<void>;
};

const NoteForm: React.FC<NoteFormProps> = ({ addNote }) => {
  const [noteContent, setNoteContent] = useState('');
  const [timestampMinutes, setTimestampMinutes] = useState('');
  const [timestampSeconds, setTimestampSeconds] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNote(noteContent, parseInt(timestampMinutes) || 0, parseInt(timestampSeconds) || 0, isVisible);
    setNoteContent('');
    setTimestampMinutes('');
    setTimestampSeconds('');
    setIsVisible(true);
    setIsModalOpen(false);
  };

  const formContent = (
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
          <input
            type="number"
            value={timestampMinutes}
            onChange={(e) => setTimestampMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)).toString())}
            min="0"
            max="59"
            placeholder="00"
            className="input input-bordered text-center w-12"
          />
          <span>分</span>
          <input
            type="number"
            value={timestampSeconds}
            onChange={(e) => setTimestampSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)).toString())}
            min="0"
            max="59"
            placeholder="00"
            className="input input-bordered text-center w-12"
          />
          <span>秒</span>
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

  return (
    <>
      {isMobile ? (
        <>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
            <FaPlus />
            メモを追加
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {formContent}
          </Modal>
        </>
      ) : (
        formContent
      )}
    </>
  );
};

export default NoteForm;
