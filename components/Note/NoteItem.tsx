import React, { useState, useEffect } from 'react';
import { Note } from '../../types/note';
import NoteContent from './NoteContent';
import NoteEditor from './NoteEditor';
import NoteActions from './NoteActions';
import Modal from './Modal';
import { handleNoteLike, handleNoteUnlike, fetchCurrentUserLike } from '../../src/api';
import { useAuth } from '../../context/AuthContext';
import { Like } from '../../types/like';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Badge from '@mui/material/Badge';
import { Avatar, Tooltip, IconButton } from '@mui/material';

interface NoteItemProps {
  note: Note;
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: number;
  onDelete?: (noteId: number) => void; // Optional
  onEdit?: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void; // Optional
  isOwner: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete = () => { }, // Default empty function
  onEdit = () => { }, // Default empty function
  isOwner,
}) => {
  const { jwtToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(note.content);
  const [newMinutes, setNewMinutes] = useState(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
  const [newSeconds, setNewSeconds] = useState(videoTimestampToSeconds(note.video_timestamp) % 60);
  const [newIsVisible, setNewIsVisible] = useState(note.is_visible);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL;
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl;

  useEffect(() => {
    if (isEditing) {
      setNewContent(note.content);
      setNewMinutes(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
      setNewSeconds(videoTimestampToSeconds(note.video_timestamp) % 60);
      setNewIsVisible(note.is_visible);
    }

    if (note.likes) {
      setLiked(note.likes.some((like: Like) => like.user_id === Number(currentUser?.id)));
    }

    // デバッグ: created_atフィールドの値をコンソールに出力
    console.log('created_at:', note.created_at);
  }, [isEditing, note, videoTimestampToSeconds, currentUser]);

  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  const handleEdit = () => {
    onEdit(note.id, newContent, newMinutes, newSeconds, newIsVisible);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleTimestampClick = () => {
    const seconds = videoTimestampToSeconds(note.video_timestamp);
    playFromTimestamp(seconds);
  };

  const handleLikeNote = async () => {
    if (!currentUser || !jwtToken || !note) {
      console.error('JWT tokenやnoteが定義されていません');
      return;
    }

    try {
      const result = await handleNoteLike(videoId, note.id, jwtToken);
      if (result.success) {
        setLiked(true);
        setLikeError(null); // エラーをクリア
        note.likes_count += 1; // ノートのいいねカウントを更新
        note.likes.push({
          id: result.like_id, // サーバーから返されたlikeのIDを使用する
          user_id: currentUser.id,
          likeable_id: note.id,
          likeable_type: 'Note',
        } as Like); // likes配列に追加
      } else {
        setLikeError(result.error ?? 'いいねに失敗しました。');
      }
    } catch (error) {
      console.error('Failed to like the note:', error);
      setLikeError('いいねに失敗しました。');
    }
  };

  const handleUnlikeNote = async () => {
    if (!currentUser || !jwtToken || !note) {
      console.error('JWT tokenやnoteが定義されていません');
      return;
    }

    try {
      const likeId = await fetchCurrentUserLike(videoId, note.id, jwtToken);
      if (!likeId) {
        setLikeError('いいねが見つかりませんでした。');
        return;
      }

      const result = await handleNoteUnlike(videoId, note.id, likeId, jwtToken);
      if (result.success) {
        setLiked(false);
        setLikeError(null); // エラーをクリア
        note.likes_count -= 1; // ノートのいいねカウントを更新
        note.likes = note.likes.filter((like) => like.user_id !== currentUser.id); // likes配列から削除
      } else {
        setLikeError(result.error ?? 'いいねの取り消しに失敗しました。');
      }
    } catch (error) {
      console.error('Failed to unlike the note:', error);
      setLikeError('いいねの取り消しに失敗しました。');
    }
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  const startEditing = () => {
    setNewContent(note.content);
    setNewMinutes(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
    setNewSeconds(videoTimestampToSeconds(note.video_timestamp) % 60);
    setNewIsVisible(note.is_visible);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  if (!note.is_visible && !isOwner) {
    return null;
  }

  return (
    <div className="note-item fixed-card-size bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {avatarUrl && (
            <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 48, height: 48, mr: 2 }} />
          )}
          <div>
            <p className="text-xl font-bold">{note.user?.name || 'Unknown User'}</p>
            <button onClick={handleTimestampClick} className="text-blue-500 hover:underline">
              {padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
            </button>
            <p className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleString()}</p> {/* 投稿日時を表示 */}
          </div>
        </div>
        <div className="h-40 overflow-y-auto mb-4">
          <NoteContent note={note} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tooltip title={liked ? "いいねを取り消す" : "いいね"}>
              <IconButton onClick={liked ? handleUnlikeNote : handleLikeNote}>
                <Badge badgeContent={note.likes_count} color="primary">
                  {liked ? <ThumbUpIcon color="primary" /> : <ThumbUpOffAltIcon />}
                </Badge>
              </IconButton>
            </Tooltip>
            {!note.is_visible && isOwner && (
              <p className="text-red-500 ml-2">非表示中</p>
            )}
          </div>
          {isOwner && (
            <NoteActions
              note={note}
              currentUser={currentUser}
              videoId={videoId}
              newMinutes={newMinutes}
              newSeconds={newSeconds}
              videoTimestampToSeconds={videoTimestampToSeconds}
              handleDelete={handleDelete}
              setIsEditing={startEditing}
            />
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteEditor
          newContent={newContent}
          newMinutes={newMinutes}
          newSeconds={newSeconds}
          newIsVisible={newIsVisible}
          setNewContent={setNewContent}
          setNewMinutes={setNewMinutes}
          setNewSeconds={setNewSeconds}
          setNewIsVisible={setNewIsVisible}
          handleEdit={handleEdit}
          setIsEditing={(value) => {
            setIsEditing(value);
            setIsModalOpen(value);
          }}
          padZero={padZero}
        />
      </Modal>
      {likeError && <div className="p-4 text-red-500">{likeError}</div>}
    </div>
  );
};

export default NoteItem;
