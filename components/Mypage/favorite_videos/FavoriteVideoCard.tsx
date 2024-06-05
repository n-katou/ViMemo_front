import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { Note } from '../../../types/note';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NoteIcon from '@mui/icons-material/Note';
import Popover from '@mui/material/Popover';
import { formatDuration, videoTimestampToSeconds, playFromTimestamp } from '../../YoutubeShow/youtubeShowUtils'; // 動画の再生時間をフォーマットする関数をインポート
import RelatedNotesList from '../../YoutubeIndex/RelatedNotesList'; // RelatedNotesListコンポーネントをインポート

// VideoCardコンポーネントのプロパティ型を定義
interface VideoCardProps {
  video: YoutubeVideo; // 表示する動画のデータ
  currentUser: any; // 現在のユーザー情報
  handleLikeVideo: (id: number) => void; // いいねクリック時のハンドラ
  handleUnlikeVideo: (id: number, likeId: number | undefined) => void; // いいね解除クリック時のハンドラ
  notes?: Note[]; // 動画に関連するノート
}

// VideoCardコンポーネントを定義
const FavoriteVideoCard: React.FC<VideoCardProps> = ({ video, currentUser, handleLikeVideo, handleUnlikeVideo, notes = [] }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [noteAnchorEl, setNoteAnchorEl] = useState<HTMLElement | null>(null); // NoteのPopover用
  const playerRef = useRef<HTMLIFrameElement | null>(null); // Playerの参照を管理

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleNotePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNoteAnchorEl(event.currentTarget);
  };

  const handleNotePopoverClose = () => {
    setNoteAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const noteOpen = Boolean(noteAnchorEl); // NoteのPopoverの状態

  const relatedNotes = notes?.filter(note => note.youtube_video_id === video.id) || [];
  console.log('Video ID:', video.id);
  console.log('Related notes:', relatedNotes);

  const renderNoteList = () => (
    <RelatedNotesList notes={relatedNotes.slice(0, 3)} playerRef={playerRef} />
  );

  return (
    <div key={video.id} className="bg-white shadow-lg rounded-lg overflow-hidden youtube-video-card group">
      <div className="video-container relative"> {/* 動画のアスペクト比を維持するためのコンテナ */}
        <iframe
          className="video absolute top-0 left-0 w-full h-full" // フレームを絶対位置に配置
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allowFullScreen
          ref={playerRef}
        />
      </div>
      <div className="p-4"> {/* カードのコンテンツ部分 */}
        <h2
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline group-hover:text-blue-700"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
        >
          {video.title}
        </h2>
        <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
        <div className="flex items-center">
          <FavoriteIcon className="text-red-500 mr-1" />
          <p className="text-gray-600">{video.likes_count}</p>
        </div>
        <div
          className="flex items-center"
          onMouseEnter={handleNotePopoverOpen}
          onMouseLeave={handleNotePopoverClose}
        >
          <NoteIcon className="text-blue-500 mr-1" />
          <p className="text-gray-600 flex items-center">
            {video.notes_count} <SearchIcon className="ml-1" />
          </p>
        </div>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
            '.MuiPopover-paper': {
              width: '600px', // ポップオーバーの幅を600pxに設定
              marginTop: '10px', // タイトルの下に表示するためにマージンを追加
              padding: '20px', // 内部の余白を追加
              borderRadius: '8px', // 角を丸くする
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // シャドウを追加
            }
          }}
          open={noteOpen}
          anchorEl={noteAnchorEl}
          anchorOrigin={{
            vertical: 'bottom', // ポップオーバーをターゲットの下に表示
            horizontal: 'center', // 水平方向の位置を中央に設定
          }}
          transformOrigin={{
            vertical: 'top', // ポップオーバーの基点を上に設定
            horizontal: 'center', // 水平方向の基点を中央に設定
          }}
          onClose={handleNotePopoverClose}
          disableRestoreFocus
        >
          {renderNoteList()}
        </Popover>
        <div className="flex items-center mt-2">
          {video.liked ? ( // 動画がいいねされている場合
            <Tooltip title="いいね解除">
              <div className="flex items-center cursor-pointer" onClick={async () => {
                if (currentUser && video.likeId) { // 現在のユーザーが存在し、いいねIDがある場合
                  await handleUnlikeVideo(video.id, video.likeId); // いいね解除の処理を呼び出す
                }
              }}>
                <IconButton color="secondary" className="like-button">
                  <FavoriteIcon style={{ color: 'red' }} /> {/* いいね済みアイコン */}
                </IconButton>
                <span style={{ color: 'black' }}>いいね解除</span> {/* いいね解除のラベル */}
              </div>
            </Tooltip>
          ) : ( // 動画がいいねされていない場合
            <Tooltip title="いいね">
              <div className="flex items-center cursor-pointer" onClick={async () => {
                await handleLikeVideo(video.id); // いいねの処理を呼び出す
              }}>
                <IconButton color="primary" className="like-button">
                  <FavoriteBorderIcon /> {/* いいねアイコン */}
                </IconButton>
                <span style={{ color: 'black' }}>いいねする</span> {/* いいねのラベル */}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteVideoCard;
