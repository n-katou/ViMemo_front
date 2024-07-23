import React from 'react';
import { Card, CardContent, Typography, Avatar, Button, Box, Tooltip, IconButton, Badge } from '@mui/material';
import { ThumbUp, ThumbUpOffAlt } from '@mui/icons-material';
import Link from 'next/link';
import { Note } from '../../../types/note';
import useNoteLike from '../../../hooks/mypage/favorite_notes/useNoteLike';

interface NoteCardProps {
  note: Note;
  jwtToken?: string; // オプションに変更
  currentUser: any;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, jwtToken, currentUser }) => {
  const { liked, likeError, likesCount, handleLike } = useNoteLike({ note, jwtToken });

  return (
    <Card className="note-card" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent className="note-card-content" sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {note.user && (
          <div className="flex items-center mb-2">
            {note.user.avatar_url && (
              <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
            )}
            <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
          </div>
        )}
        <Typography variant="subtitle1" color="textPrimary" className="note-card-title">
          {note.youtube_video_title || 'タイトルを取得できませんでした'}
        </Typography>
        <Box mb={2} sx={{ maxHeight: '150px', overflowY: 'auto' }}>
          <Typography variant="body2" color="textSecondary" className="note-content">
            {note.content}
          </Typography>
        </Box>
      </CardContent>
      <Box className="note-card-actions" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Tooltip title={liked ? "いいねを取り消す" : "いいね"}>
          <IconButton onClick={handleLike}>
            <Badge badgeContent={likesCount} color="primary">
              {liked ? <ThumbUp color="primary" /> : <ThumbUpOffAlt />}
            </Badge>
          </IconButton>
        </Tooltip>
        {note.youtube_video_id && (
          <Link href={`/youtube_videos/${note.youtube_video_id}`} passHref legacyBehavior>
            <Button variant="contained" className="btn btn-outline btn-darkpink" size="small">
              この動画を見る
            </Button>
          </Link>
        )}
      </Box>
    </Card>
  );
};

export default NoteCard;
