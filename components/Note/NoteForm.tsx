import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from './Modal'; // モーダルコンポーネントのインポート
import useMediaQuery from '../../hooks/useMediaQuery'; // カスタムフックをインポート
import { useTheme } from 'next-themes';

type NoteFormProps = {
  addNote: (content: string, minutes: number, seconds: number, isVisible: boolean) => Promise<void>; // メモを追加する関数の型
};

const NoteForm: React.FC<NoteFormProps> = ({ addNote }) => {
  // コンポーネントの状態を定義
  const [noteContent, setNoteContent] = useState(''); // メモの内容
  const [timestampMinutes, setTimestampMinutes] = useState(''); // タイムスタンプの分
  const [timestampSeconds, setTimestampSeconds] = useState(''); // タイムスタンプの秒
  const [isVisible, setIsVisible] = useState(true); // メモの表示/非表示
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示/非表示

  const isMobile = useMediaQuery('(max-width: 768px)'); // 画面サイズがモバイルかどうかを判定するカスタムフック
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // フォームの送信を処理する関数
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防止
    addNote(noteContent, parseInt(timestampMinutes) || 0, parseInt(timestampSeconds) || 0, isVisible); // メモを追加
    // フォームの状態をリセット
    setNoteContent('');
    setTimestampMinutes('');
    setTimestampSeconds('');
    setIsVisible(true);
    setIsModalOpen(false);
  };

  // フォームの内容を定義
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-md text-black dark:bg-gray-800">
      <div className="form-control">
        <label className="label font-semibold text-gray-700 dark:text-gray-300">メモを入力:</label>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)} // メモの内容が変更されたときに状態を更新
          placeholder="メモを入力..."
          required // フィールドが必須であることを指定
          className={`textarea textarea-bordered h-32 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'text-black'}`}
        />
      </div>
      <div className="form-control">
        <label className="label font-semibold text-gray-700 dark:text-gray-300">タイムスタンプ:</label>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={timestampMinutes} // タイムスタンプの分
            onChange={(e) => setTimestampMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)).toString())} // タイムスタンプの分が変更されたときに状態を更新
            min="0"
            max="59"
            placeholder="00"
            className={`input input-bordered text-center w-12 ${isDarkMode ? 'bg-gray-700 text-white' : 'text-black'}`}
          />
          <span className={isDarkMode ? 'text-white' : ''}>分</span>
          <input
            type="number"
            value={timestampSeconds} // タイムスタンプの秒
            onChange={(e) => setTimestampSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)).toString())} // タイムスタンプの秒が変更されたときに状態を更新
            min="0"
            max="59"
            placeholder="00"
            className={`input input-bordered text-center w-12 ${isDarkMode ? 'bg-gray-700 text-white' : 'text-black'}`}
          />
          <span className={isDarkMode ? 'text-white' : ''}>秒</span>
        </div>
      </div>
      <div className="form-control">
        <label className="label font-semibold text-gray-700 dark:text-gray-300">表示:</label>
        <select
          value={isVisible ? 'true' : 'false'} // メモの表示/非表示状態
          onChange={(e) => setIsVisible(e.target.value === 'true')} // 表示/非表示の状態が変更されたときに状態を更新
          className={`select select-bordered p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'text-black'}`}
        >
          <option value="true">表示する</option>
          <option value="false">表示しない</option>
        </select>
      </div>
      <div className="form-control">
        <button type="submit" className="btn btn-outline btn-perple w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
          メモを追加
        </button>
      </div>
    </form>
  );

  // コンポーネントのレンダリング
  return (
    <>
      {isMobile ? (
        <>
          {/* モバイルデバイスの場合、モーダルを開くボタンを表示 */}
          <button onClick={() => setIsModalOpen(true)} className="btn bg-gradient-rainbow flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition duration-200">
            <FaPlus />
            メモを追加
          </button>
          {/* モーダルが開いている場合にフォームを表示 */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {formContent}
          </Modal>
        </>
      ) : (
        // モバイルデバイスでない場合、直接フォームを表示
        formContent
      )}
    </>
  );
};

export default NoteForm;
