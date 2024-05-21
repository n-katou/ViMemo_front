import React from 'react';
import Link from 'next/link';

interface NoteCardProps {
  videoTitle: string;
  content: string;
  videoTimestamp: string;
  youtubeVideoId: number;
}

const NoteCard: React.FC<NoteCardProps> = ({ videoTitle, content, videoTimestamp, youtubeVideoId }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{videoTitle}</h2>
        <p className="text-gray-600 mb-2"><strong>メモ内容:</strong> {content}</p>
        <p className="text-gray-600 mb-4"><strong>タイムスタンプ:</strong> {videoTimestamp}</p>
      </div>
      <Link href={`/youtube_videos/${youtubeVideoId}`} legacyBehavior>
        <a className="text-blue-500 hover:underline self-end">
          YouTube動画を見る
        </a>
      </Link>
    </div>
  );
};

export default NoteCard;
