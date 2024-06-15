import React from 'react';
import { Note } from '../../../types/note';
import { BsTwitterX } from "react-icons/bs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface NoteActionsProps {
  note: Note; // メモの情報を持つNoteオブジェクト
  currentUser: any; // 現在のユーザー情報
  videoId: number; // ビデオのID
  newMinutes: number; // 新しい分の値
  newSeconds: number; // 新しい秒の値
  videoTimestampToSeconds: (timestamp: string) => number; // タイムスタンプを秒に変換する関数
  handleDelete: () => void; // メモを削除するための関数
  setIsEditing: (isEditing: boolean) => void; // 編集モードに切り替える関数
}

const NoteActions: React.FC<NoteActionsProps> = ({
  note,
  currentUser,
  newMinutes,
  newSeconds,
  videoTimestampToSeconds,
  handleDelete,
  setIsEditing
}) => {
  // 数値を2桁にパディングする関数
  const padZero = (num: number) => num.toString().padStart(2, '0');

  // YouTube動画のIDを取得
  const youtubeId = note.youtube_video?.youtube_id;

  // 共有メッセージを作成
  const shareMessage = `【シェア】\n\n🔖タイムスタンプ: ${padZero(newMinutes)}:${padZero(newSeconds)}\n📝メモ: ${note.content}\n📺YouTube: https://www.youtube.com/watch?v=${youtubeId}&t=${videoTimestampToSeconds(note.video_timestamp)}s\n\nViMemoでシェアしよう✍️`;

  // Twitterの共有URLを作成
  const shareUrl = youtubeId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareMessage)}` : '';

  return (
    <div className="card-actions mt-4 flex space-x-4">
      {/* ユーザーがメモの所有者である場合に編集と削除のボタンを表示 */}
      {currentUser?.id === note.user?.id && (
        <>
          {/* YouTube IDが存在する場合に共有ボタンを表示 */}
          {youtubeId ? (
            <IconButton
              href={shareUrl}
              target="_blank"
              className="btn btn-outline btn-primary share-button"
              style={{ color: 'white', backgroundColor: 'black' }}
            >
              <BsTwitterX />
            </IconButton>
          ) : (
            <p>YouTube IDが見つかりません</p>)}
          <IconButton onClick={() => setIsEditing(true)} className="btn btn-outline btn-info edit-button" style={{ color: 'white' }}>
            <EditIcon style={{ color: 'white' }} />
          </IconButton>
          <IconButton onClick={handleDelete} className="btn btn-outline btn-error delete-button" style={{ color: 'white' }}>
            <DeleteIcon style={{ color: 'white' }} />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default NoteActions;
