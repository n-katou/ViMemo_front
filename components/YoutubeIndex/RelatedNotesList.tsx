import React from 'react';
import { Note } from '../../types/note';
import { Avatar, Typography, Card, CardContent, CardHeader, Button } from '@mui/material';
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
    <div>
      <Typography variant="h6" gutterBottom>メモ一覧</Typography>
      {displayNotes.length > 0 ? (
        displayNotes.map(note => {
          const avatarUrl = note.user.avatar || '/default-avatar.jpg';
          return (
            <Card key={note.id} className="mb-4" sx={{ maxWidth: 600 }}>
              <CardHeader
                avatar={<Avatar src={avatarUrl} alt="User Avatar" />}
                title={note.user.name || 'Unknown User'}
                subheader={
                  <>
                    <Button onClick={() => playFromTimestamp(videoTimestampToSeconds(note.video_timestamp), playerRef)} color="primary">
                      {padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
                    </Button>
                    <Typography variant="body2" color="textSecondary">{new Date(note.created_at).toLocaleString()}</Typography>
                  </>
                }
              />
              <CardContent>
                <NoteContent note={note} />
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography variant="body1" color="textSecondary">メモがありません。</Typography>
      )}
    </div>
  );
};

export default RelatedNotesList;
