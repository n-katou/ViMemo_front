import React, { useState, useEffect } from 'react';
import { Note } from '../../types/note'; // Note 型をインポート
import NoteContent from './NoteContent'; // NoteContent コンポーネントをインポート
import NoteEditor from './NoteEditor'; // NoteEditor コンポーネントをインポート
import NoteActions from './NoteActions'; // NoteActions コンポーネントをインポート
import Modal from './Modal'; // モーダルコンポーネントをインポート
import { handleNoteLike, handleNoteUnlike, fetchCurrentUserLike } from '../../src/api'; // API関数をインポート
import { useAuth } from '../../context/AuthContext'; // 認証コンテキストをインポート
import { Like } from '../../types/like'; // Like 型をインポート
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; 
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Badge from '@mui/material/Badge';
import { Avatar, Tooltip, IconButton } from '@mui/material'; 

interface NoteItemProps {
  note: Note; // メモのデータ
  currentUser: any; // 現在のユーザー情報
  videoTimestampToSeconds: (timestamp: string) => number; // タイムスタンプを秒に変換する関数
  playFromTimestamp: (seconds: number) => void; // タイムスタンプから再生を開始する関数
  videoId: number; // 動画のID
  onDelete?: (noteId: number) => void; // メモを削除する関数（オプション）
  onEdit?: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void; // メモを編集する関数（オプション）
  isOwner: boolean; // ユーザーがメモの所有者かどうか
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete = () => { }, // デフォルトの空関数
  onEdit = () => { }, // デフォルトの空関数
  isOwner,
}) => {
  const { jwtToken } = useAuth(); // 認証コンテキストからJWTトークンを取得
  const [isEditing, setIsEditing] = useState(false); // 編集モードの状態を管理
  const [newContent, setNewContent] = useState(note.content); // 新しいメモの内容
  const [newMinutes, setNewMinutes] = useState(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60)); // 新しいタイムスタンプの分
  const [newSeconds, setNewSeconds] = useState(videoTimestampToSeconds(note.video_timestamp) % 60); // 新しいタイムスタンプの秒
  const [newIsVisible, setNewIsVisible] = useState(note.is_visible); // メモの表示/非表示の状態
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示/非表示の状態
  const [liked, setLiked] = useState<boolean>(false); // いいねの状態
  const [likeError, setLikeError] = useState<string | null>(null); // いいねエラーの状態
  const defaultAvatarUrl = process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL; // デフォルトのアバターURL
  const avatarUrl = note.user?.avatar ? note.user.avatar : defaultAvatarUrl; // ユーザーのアバターURL

  // コンポーネントのマウント時と状態の変更時に実行
  useEffect(() => {
    if (isEditing) {
      initializeEditor();
    }
    if (note.likes) {
      setLiked(note.likes.some((like: Like) => like.user_id === Number(currentUser?.id)));
    }
  }, [isEditing, note, videoTimestampToSeconds, currentUser]);

  // 編集モードを初期化する関数
  const initializeEditor = () => {
    setNewContent(note.content);
    setNewMinutes(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
    setNewSeconds(videoTimestampToSeconds(note.video_timestamp) % 60);
    setNewIsVisible(note.is_visible);
  };

  // メモを削除する関数
  const handleDelete = () => {
    if (confirm('このメモを削除しますか？')) {
      onDelete(note.id);
    }
  };

  // メモを編集する関数
  const handleEdit = () => {
    onEdit(note.id, newContent, newMinutes, newSeconds, newIsVisible);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  // タイムスタンプをクリックした時に再生を開始する関数
  const handleTimestampClick = () => {
    playFromTimestamp(videoTimestampToSeconds(note.video_timestamp));
  };

  // メモにいいねをする関数
  const handleLikeNote = async () => {
    if (!currentUser || !jwtToken || !note) {
      console.error('JWT tokenやnoteが定義されていません');
      return;
    }

    try {
      const result = await handleNoteLike(videoId, note.id, jwtToken);
      if (result.success) {
        updateLikeState(true, result.like_id);
      } else {
        setLikeError(result.error ?? 'いいねに失敗しました。');
      }
    } catch (error) {
      console.error('Failed to like the note:', error);
      setLikeError('いいねに失敗しました。');
    }
  };

  // メモのいいねを取り消す関数
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
        updateLikeState(false);
      } else {
        setLikeError(result.error ?? 'いいねの取り消しに失敗しました。');
      }
    } catch (error) {
      console.error('Failed to unlike the note:', error);
      setLikeError('いいねの取り消しに失敗しました。');
    }
  };

  // いいねの状態を更新する関数
  const updateLikeState = (isLiked: boolean, likeId?: number) => {
    setLiked(isLiked);
    setLikeError(null); // エラーをクリア
    if (isLiked) {
      note.likes_count += 1; // ノートのいいねカウントを更新
      note.likes.push({
        id: likeId!, // サーバーから返されたlikeのIDを使用する
        user_id: currentUser.id,
        likeable_id: note.id,
        likeable_type: 'Note',
      } as Like); // likes配列に追加
    } else {
      note.likes_count -= 1; // ノートのいいねカウントを更新
      note.likes = note.likes.filter((like) => like.user_id !== currentUser.id); // likes配列から削除
    }
  };

  // 数値を2桁にパディングする関数
  const padZero = (num: number) => num.toString().padStart(2, '0');

  // 編集モードを開始する関数
  const startEditing = () => {
    initializeEditor();
    setIsEditing(true);
    setIsModalOpen(true);
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
              <IconButton onClick={liked ? handleUnlikeNote : handleLikeNote}>
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
              setIsEditing={startEditing}
            />
          )}
        </div>
      </div>
      {/* 編集用のモーダル */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-full overflow-y-auto p-4">
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
        </div>
      </Modal>
      {/* いいねエラーの表示 */}
      {likeError && <div className="p-4 text-red-500">{likeError}</div>}
    </div>
  );
};

export default NoteItem;
