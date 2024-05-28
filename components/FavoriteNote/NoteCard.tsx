import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Button, Box, Tooltip, IconButton, Badge } from '@mui/material';
import { ThumbUp, ThumbUpOffAlt } from '@mui/icons-material';
import Link from 'next/link';
import { Note } from '../../types/note';
import { handleNoteLike, handleNoteUnlike, fetchCurrentUserLike } from '../../src/api';

interface NoteCardProps {
  note: Note;
  jwtToken?: string; // オプションに変更
  currentUser: any;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, jwtToken, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [likeId, setLikeId] = useState<number | null>(null); // likeIdを追加
  const [likesCount, setLikesCount] = useState(note.likes_count); // likes_countを状態として管理

  const fetchLikeStatus = async () => {
    if (jwtToken) {
      try {
        const fetchedLikeId = await fetchCurrentUserLike(note.youtube_video_id, note.id, jwtToken);
        if (fetchedLikeId) {
          setLiked(true);
          setLikeId(fetchedLikeId);
        } else {
          setLiked(false);
          setLikeId(null);
        }
      } catch (error) {
        console.error('Failed to fetch current user like status:', error);
      }
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [note.youtube_video_id, note.id, jwtToken]);

  const handleLike = async () => {
    if (!jwtToken) return;

    if (liked && likeId !== null) {
      const result = await handleNoteUnlike(note.youtube_video_id, note.id, likeId, jwtToken);
      if (result.success) {
        setLiked(false);
        setLikeId(null);
        setLikesCount(prevCount => prevCount - 1); // いいね解除時にカウントを減少
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    } else {
      const result = await handleNoteLike(note.youtube_video_id, note.id, jwtToken);
      if (result.success) {
        setLiked(true);
        setLikeId(result.like_id);
        setLikesCount(prevCount => prevCount + 1); // いいね時にカウントを増加
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    }
    await fetchLikeStatus(); // アクションの後に状態を再取得
  };

  return (
    <Card className="note-card">
      <CardContent className="note-card-content">
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
        <Typography variant="body2" color="textSecondary" className="note-content">
          {note.content}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="note-card-likes">
          <Tooltip title={liked ? "いいねを取り消す" : "いいね"}>
            <IconButton onClick={handleLike}>
              <Badge badgeContent={likesCount} color="primary">
                {liked ? <ThumbUp color="primary" /> : <ThumbUpOffAlt />}
              </Badge>
            </IconButton>
          </Tooltip>
        </Typography>
        {note.youtube_video_id && (
          <Box className="fixed-button-container">
            <Link href={`/youtube_videos/${note.youtube_video_id}`} passHref legacyBehavior>
              <Button variant="contained" className="btn btn-outline btn-darkpink" size="small">
                この動画を見る
              </Button>
            </Link>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
