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

interface NoteItemProps {
  note: Note;
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: number;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void;
  isOwner: boolean;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete,
  onEdit,
  isOwner
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
        note.likes_count += 1;  // ノートのいいねカウントを更新
        note.likes.push({
          id: result.like_id,  // サーバーから返されたlikeのIDを使用する
          user_id: currentUser.id,
          likeable_id: note.id,
          likeable_type: 'Note'
        } as Like);  // likes配列に追加
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
        note.likes_count -= 1;  // ノートのいいねカウントを更新
        note.likes = note.likes.filter(like => like.user_id !== currentUser.id);  // likes配列から削除
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
    <div className="card border border-blue-200 mx-auto w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 rounded-lg overflow-hidden">
      <div className="card-body p-6">
        <div className="flex items-center mb-4">
          {avatarUrl && <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />}
          <div>
            <p className="text-xl font-bold">{note.user?.name || 'Unknown User'}</p>
            <button onClick={handleTimestampClick} className="text-blue-500 hover:underline">
              {padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
            </button>
          </div>
        </div>
        <div className="h-40 overflow-y-auto"> {/* 固定の高さを設定し、スクロールを許可 */}
          <NoteContent note={note} />
        </div>
        <div className="mt-4 flex items-center">
          <Badge badgeContent={note.likes_count} color="primary" className="mr-4">
            {liked ? (
              <ThumbUpIcon onClick={handleUnlikeNote} className="text-blue-500 cursor-pointer" />
            ) : (
              <ThumbUpOffAltIcon onClick={handleLikeNote} className="text-gray-500 cursor-pointer" />
            )}
          </Badge>
          {!note.is_visible && isOwner && (
            <p><span className="badge badge-error">非表示中</span></p>
          )}
        </div>
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
      {likeError && <div className="error-message">{likeError}</div>}
    </div>
  );
};

export default NoteItem;
