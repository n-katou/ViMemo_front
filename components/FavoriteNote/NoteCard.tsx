import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Button, Box, Tooltip, IconButton, Badge } from '@mui/material';
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
  // 状態変数を定義
  const [liked, setLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [likeId, setLikeId] = useState<number | null>(null); // likeIdを追加
  const [likesCount, setLikesCount] = useState(note.likes_count); // likes_countを状態として管理

  // 現在のユーザーのいいねステータスを取得する関数
  const fetchLikeStatus = async () => {
    if (jwtToken) {
      try {
        // APIから現在のユーザーのいいねIDを取得
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

  // コンポーネントがマウントされた時にいいねステータスを取得
  useEffect(() => {
    fetchLikeStatus();
  }, [note.youtube_video_id, note.id, jwtToken]);

  // いいねボタンがクリックされた時の処理
  const handleLike = async () => {
    if (!jwtToken) return;

    if (liked && likeId !== null) {
      // いいねを解除する処理
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
      // いいねを追加する処理
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
    <Card className="note-card" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent className="note-card-content" sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {/* ユーザー情報を表示 */}
        {note.user && (
          <div className="flex items-center mb-2">
            {note.user.avatar_url && (
              <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
            )}
            <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
          </div>
        )}
        {/* 動画タイトルを表示 */}
        <Typography variant="subtitle1" color="textPrimary" className="note-card-title">
          {note.youtube_video_title || 'タイトルを取得できませんでした'}
        </Typography>
        {/* メモ内容を表示 */}
        <Box mb={2} sx={{ maxHeight: '150px', overflowY: 'auto' }}>
          <Typography variant="body2" color="textSecondary" className="note-content">
            {note.content}
          </Typography>
        </Box>
      </CardContent>
      {/* いいねボタンと動画リンクを表示 */}
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
