import React from 'react';
import { Note } from '../../types/note';
import { Avatar, Button, Typography } from '@mui/material';
import { videoTimestampToSeconds, playFromTimestamp } from '../YoutubeShow/youtubeShowUtils';
import { padZero } from '../Note/noteItemFunctions';

import NoteContent from '../Note/NoteContent'; // NoteContent コンポーネントをインポート

interface RelatedNotesListProps {
  notes: Note[];
  playerRef: React.RefObject<HTMLIFrameElement>;
}

const RelatedNotesList: React.FC<RelatedNotesListProps> = ({ notes, playerRef }) => {
  // 最新の6件のメモを取得
  const sortedNotes = [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const displayNotes = sortedNotes.slice(0, 3);

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <Typography variant="h6" gutterBottom>メモ一覧</Typography>
      {displayNotes.length > 0 ? (
        displayNotes.map(note => {
          const avatarUrl = note.user.avatar || '/default-avatar.jpg';
          return (
            <div key={note.id} className="note-item fixed-card-size bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
              <div className="p-6 text-black">
                <div className="flex items-center mb-4">
                  {avatarUrl && (
                    <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 48, height: 48, mr: 2 }} />
                  )}
                  <div>
                    <p className="text-xl font-bold">{note.user.name || 'Unknown User'}</p>
                    {/* タイムスタンプをクリックすると再生が開始 */}
                    <button onClick={() => playFromTimestamp(videoTimestampToSeconds(note.video_timestamp), playerRef)} className="text-blue-500 hover:underline">
                      {padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
                    </button>
                    {/* 投稿日時の表示 */}
                    <p className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-40 overflow-y-auto mb-1">
                  <NoteContent note={note} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Typography variant="body1" color="textSecondary">メモがありません。</Typography>
      )}
    </div>
  );
};

export default RelatedNotesList;
