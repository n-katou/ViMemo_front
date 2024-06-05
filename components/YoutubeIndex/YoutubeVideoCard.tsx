import React, { useState, useRef } from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Like } from '../../types/like';
import { Note } from '../../types/note'; // Note型のインポート
import { useAuth } from '../../context/AuthContext'; // 認証コンテキストをインポート
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { formatDuration, videoTimestampToSeconds, playFromTimestamp, handleDeleteNote, handleEditNote } from '../YoutubeShow/youtubeShowUtils';
import NoteList from '../../components/Note/NoteList'; // NoteListコンポーネントのインポート

// YoutubeVideoCardコンポーネントのプロパティ型を定義
interface YoutubeVideoCardProps {
  video: YoutubeVideo;
  handleTitleClick: (id: number) => void; // タイトルクリック時のハンドラ
  handleLikeVideo: (id: number) => Promise<void>; // いいねクリック時のハンドラ
  handleUnlikeVideo: (id: number, likeId: number) => Promise<void>; // いいね解除クリック時のハンドラ
  notes: Note[]; // Note型の配列
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>; // Note配列の状態を設定する関数
  jwtToken: string | null; // JWTトークン
}

// YoutubeVideoCardコンポーネントを定義
const YoutubeVideoCard: React.FC<YoutubeVideoCardProps> = ({ video, handleTitleClick, handleLikeVideo, handleUnlikeVideo, notes, setNotes, jwtToken }) => {
  const { currentUser } = useAuth(); // 認証コンテキストから現在のユーザー情報を取得
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const playerRef = useRef<HTMLIFrameElement | null>(null); // Playerの参照を管理

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const relatedNotes = notes.filter(note => note.youtube_video_id === video.id);
  console.log('Video ID:', video.id);
  console.log('Related notes:', relatedNotes);

  const renderNoteList = () => (
    <div style={{ padding: '10px', maxWidth: '400px' }}>
      <NoteList
        notes={relatedNotes} // 動画に関連するメモをフィルタリング
        currentUser={currentUser}
        videoTimestampToSeconds={videoTimestampToSeconds}
        playFromTimestamp={(seconds) => playFromTimestamp(seconds, playerRef)}
        videoId={video.id}
        onDelete={currentUser && jwtToken ? (noteId) => handleDeleteNote(noteId, jwtToken, video, setNotes) : undefined}
        onEdit={currentUser && jwtToken ? (noteId, newContent, newMinutes, newSeconds, newIsVisible) => handleEditNote(noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken, video, setNotes) : undefined}
      />
    </div>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden youtube-video-card">
      <div className="video-container"> {/* 動画のアスペクト比を維持するためのラッパー */}
        <iframe
          className="video" // フレームを絶対配置
          src={`https://www.youtube.com/embed/${video.youtube_id}`} // YouTube動画のURLを設定
          frameBorder="0"
          allowFullScreen
          ref={playerRef}
        />
      </div>
      <div className="p-4">
        <h2
          onClick={() => handleTitleClick(video.id)}
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          {video.title}
        </h2>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {renderNoteList()}
        </Popover>
        <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
        <div className="flex items-center">
          <FavoriteIcon className="text-red-500 mr-1" />
          <p className="text-gray-600">{video.likes_count}</p>
        </div>
        <div className="flex items-center">
          <NoteIcon className="text-blue-500 mr-1" />
          <p className="text-gray-600">{video.notes_count}</p>
        </div>
        {currentUser && ( // ユーザーがログインしている場合にのみいいね機能を表示
          <div className="flex items-center mt-2">
            {video.liked ? ( // 動画がいいねされている場合
              <Tooltip title="いいね解除">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  if (currentUser) { // ログインしている場合
                    const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                    if (like) {
                      await handleUnlikeVideo(video.id, like.id); // いいね解除の処理
                    }
                  }
                }}>
                  <IconButton
                    color="secondary"
                    className="like-button"
                  >
                    <FavoriteIcon style={{ color: 'red' }} /> {/* いいね済みアイコンを表示 */}
                  </IconButton>
                  <span style={{ color: 'black' }}>いいね解除</span> {/* いいね解除のラベル */}
                </div>
              </Tooltip>
            ) : ( // 動画がいいねされていない場合
              <Tooltip title="いいね">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  await handleLikeVideo(video.id); // いいねの処理
                }}>
                  <IconButton
                    color="primary"
                    className="like-button"
                  >
                    <FavoriteBorderIcon /> {/* いいねアイコンを表示 */}
                  </IconButton>
                  <span style={{ color: 'black' }}>いいねする</span> {/* いいねのラベル */}
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoCard;
