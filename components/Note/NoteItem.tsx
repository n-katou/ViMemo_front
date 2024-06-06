import React, { useState, useEffect } from 'react';
import { Note } from '../../types/note';
import { Like } from '../../types/like';
import { useAuth } from '../../context/AuthContext'; // 認証コンテキストをインポート
import NoteContent from './NoteContent'; // NoteContent コンポーネントをインポート
import NoteActions from './NoteActions'; // NoteActions コンポーネントをインポート
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Badge from '@mui/material/Badge';
import { Avatar, Tooltip, IconButton } from '@mui/material';
import { initializeEditor, handleLikeNote, handleUnlikeNote, padZero } from './noteItemFunctions';

interface NoteItemProps {
  note: Note; // メモのデータ
  currentUser: any; // 現在のユーザー情報
  videoTimestampToSeconds: (timestamp: string) => number; // タイムスタンプを秒に変換する関数
  playFromTimestamp: (seconds: number) => void; // タイムスタンプから再生を開始する関数
  videoId: number; // 動画のID
  onDelete?: (noteId: number) => void; // メモを削除する関数（オプション）
  onEditClick: (note: Note) => void; // 編集クリック時の関数
  isOwner: boolean; // ユーザーがメモの所有者かどうか
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete = () => { }, // デフォルトの空関数
  onEditClick,
  isOwner,
}) => {
  const { jwtToken } = useAuth(); // 認証コンテキストからJWTトークンを取得
  const [isEditing, setIsEditing] = useState(false); // 編集モードの状態を管理
  const [newContent, setNewContent] = useState(note.content); // 新しいメモの内容
  const [newMinutes, setNewMinutes] = useState(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60)); // 新しいタイムスタンプの分
  const [newSeconds, setNewSeconds] = useState(videoTimestampToSeconds(note.video_timestamp) % 60); // 新しいタイムスタンプの秒
  const [newIsVisible, setNewIsVisible] = useState(note.is_visible); // メモの表示/非表示の状態
  const [liked, setLiked] = useState<boolean>(false); // いいねの状態
  const [likeError, setLikeError] = useState<string | null>(null); // いいねエラーの状態
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL; // デフォルトのアバターURL
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl; // ユーザーのアバターURL

  // コンポーネントのマウント時と状態の変更時に実行
  useEffect(() => {
    if (isEditing) {
      // 編集モードを初期化
      initializeEditor(
        note,
        videoTimestampToSeconds,
        setNewContent,
        setNewMinutes,
        setNewSeconds,
        setNewIsVisible
      );
    }
    if (note.likes) {
      // いいねの状態を設定
      setLiked(note.likes.some((like: Like) => like.user_id === Number(currentUser?.id)));
    }
  }, [isEditing, note, videoTimestampToSeconds, currentUser]);

  // メモを削除する関数
  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  // タイムスタンプをクリックした時に再生を開始する関数
  const handleTimestampClick = () => {
    playFromTimestamp(videoTimestampToSeconds(note.video_timestamp));
  };

  // メモが非表示で所有者でない場合、何も表示しない
  if (!note.is_visible && !isOwner) {
    return null;
  }

  return (
    <div className="note-item fixed-card-size bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
      <div className="p-6 text-black">
        <div className="flex items-center mb-4">
          {avatarUrl && (
            <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 48, height: 48, mr: 2 }} />
          )}
          <div>
            <p className="text-xl font-bold">{note.user?.name || 'Unknown User'}</p>
            {/* タイムスタンプをクリックすると再生が開始 */}
            <button onClick={handleTimestampClick} className="text-blue-500 hover:underline">
              {padZero(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60))}:{padZero(videoTimestampToSeconds(note.video_timestamp) % 60)}
            </button>
            {/* 投稿日時の表示 */}
            <p className="text-gray-500 text-sm">{new Date(note.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="h-40 overflow-y-auto mb-1">
          <NoteContent note={note} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tooltip title={liked ? "いいねを取り消す" : "いいね"}>
              <IconButton onClick={liked ? () => handleUnlikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError) : () => handleLikeNote(videoId, note, jwtToken || '', currentUser, setLiked, setLikeError)}>
                <Badge badgeContent={note.likes_count} color="primary">
                  {liked ? <ThumbUpIcon color="primary" /> : <ThumbUpOffAltIcon />}
                </Badge>
              </IconButton>
            </Tooltip>
            {/* メモが非表示の場合のメッセージ */}
            {!note.is_visible && isOwner && (
              <p className="text-red-500 ml-2">非表示中</p>
            )}
          </div>
          {/* メモの所有者である場合、編集・削除ボタンを表示 */}
          {isOwner && (
            <NoteActions
              note={note}
              currentUser={currentUser}
              videoId={videoId}
              newMinutes={newMinutes}
              newSeconds={newSeconds}
              videoTimestampToSeconds={videoTimestampToSeconds}
              handleDelete={handleDelete}
              setIsEditing={() => onEditClick(note)} // モーダルを開く関数を呼び出す
            />
          )}
        </div>
      </div>
      {/* いいねエラーの表示 */}
      {likeError && <div className="p-4 text-red-500">{likeError}</div>}
    </div>
  );
};

export default NoteItem;
