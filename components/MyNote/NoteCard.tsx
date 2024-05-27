import React from 'react';
import Link from 'next/link';
import { FaTrashAlt } from 'react-icons/fa';

interface NoteCardProps {
  videoTitle: string; // 動画のタイトル
  content: string; // メモの内容
  videoTimestamp: string; // メモのタイムスタンプ
  youtubeVideoId: number; // YouTube動画のID
  createdAt: string; // メモの作成日時
  onDelete: () => void; // メモを削除するための関数
}

const NoteCard: React.FC<NoteCardProps> = ({ videoTitle, content, videoTimestamp, youtubeVideoId, createdAt, onDelete }) => {
  // 削除ボタンがクリックされたときの処理
  const handleDelete = () => {
    // 確認ダイアログを表示し、ユーザーが削除を確認した場合にonDelete関数を呼び出す
    if (window.confirm('本当に削除しますか？')) {
      onDelete();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{videoTitle}</h2>
        <p className="text-gray-600 mb-2"><strong>メモ内容:</strong> {content}</p>
        <p className="text-gray-600 mb-2"><strong>タイムスタンプ:</strong> {videoTimestamp}</p>
        <p className="text-gray-600 mb-4"><strong>作成日時:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link href={`/youtube_videos/${youtubeVideoId}`} legacyBehavior>
          <a className="text-blue-500 hover:underline">
            この動画を見る
          </a>
        </Link>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 ml-4"
          title="削除"
        >
          <FaTrashAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
