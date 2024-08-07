import React from 'react';
import Link from 'next/link';
import { FaTrashAlt } from 'react-icons/fa';

interface NoteCardProps {
  videoTitle: string;
  content: string;
  videoTimestamp: string;
  youtubeVideoId: number;
  noteId: number;
  createdAt: string;
  onDelete: (youtubeVideoId: number, noteId: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ videoTitle, content, videoTimestamp, youtubeVideoId, noteId, createdAt, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('本当に削除しますか？')) {
      onDelete(youtubeVideoId, noteId);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{videoTitle}</h2>
        <p className="text-gray-600 mb-2"><strong>メモ内容:</strong> {content}</p>
        <p className="text-gray-600 mb-2"><strong>タイムスタンプ:</strong> {videoTimestamp}</p>
        <p className="text-gray-600 mb-4"><strong>作成日時:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link href={`/youtube_videos/${youtubeVideoId}`} passHref legacyBehavior>
          <a className="btn-outline btn-lightperple">
            この動画を見る
          </a>
        </Link>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 ml-4 transition-colors duration-300"
          title="削除"
        >
          <FaTrashAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
