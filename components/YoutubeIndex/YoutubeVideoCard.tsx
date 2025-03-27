import React, { useState, useRef } from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Like } from '../../types/like';
import { Note } from '../../types/note'; // Note型のインポート
import { useAuth } from '../../context/AuthContext'; // 認証コンテキストをインポート
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import { formatDuration } from '../YoutubeShow/youtubeShowUtils';
import RelatedNotesList from './RelatedNotesList'; // RelatedNotesListコンポーネントのインポート
import ReactPlayer from 'react-player';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';


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
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<HTMLIFrameElement | null>(null); // Playerの参照を管理
  const [isHovered, setIsHovered] = useState(false); // PC用
  const [isActive, setIsActive] = useState(false);   // モバイル用
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // 関連するメモを取得し、作成日時の降順でソート
  const relatedNotes = notes
    .filter(note => note.youtube_video_id === video.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log('Video ID:', video.id);
  console.log('Related notes:', relatedNotes);

  const renderNoteList = () => (
    <RelatedNotesList notes={relatedNotes.slice(0, 3)} playerRef={playerRef} />
  );

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const isMobile = useMediaQuery('(max-width: 768px)');


  const handleCardClose = () => {
    if (isMobile) {
      setIsActive(false);
      setIsHovered(false);
      setIsMuted(true);
    }
  };

  const isVisible = isMobile ? isActive : isHovered;

  React.useEffect(() => {
    if (!isActive) {
      setIsHovered(false);
    }
  }, [isActive]);

  return (
    <div
      className="relative rounded-lg overflow-hidden transition-all duration-300"
      onMouseEnter={() => {
        if (!isMobile) {
          hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 300);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          setIsHovered(false);
        }
      }}
      onClick={() => isMobile && setIsActive(true)}
    >
      {isMobile && isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // ← これで親のonClickが発火しない！
            handleCardClose();
          }}
          className="absolute top-2 left-2 text-white bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center z-50 pointer-events-auto"
        >
          ×
        </button>
      )}
      {/* Wrapper 全体を motion.div にして高さ調整 */}
      <motion.div
        initial={{ height: 180 }}
        animate={{ height: isVisible ? 380 : 180 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* 動画部分 */}
        <div className="relative w-full h-[180px]">
          {isVisible ? (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video.youtube_id}`}
              playing
              muted={isMuted}
              controls={false}
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            />
          ) : (
            <img
              src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
              alt={video.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          )}
          {isVisible && (
            <IconButton
              onClick={toggleMute}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                zIndex: 30,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          )}
        </div>

        {/* 情報部分（motion.divでふわっと出す） */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              <h2
                onClick={() => handleTitleClick(video.id)}
                className="text-xl font-bold text-blue-600 cursor-pointer hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
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
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <NoteIcon className="text-blue-500 mr-1" />
                <p className="text-gray-600 flex items-center">
                  {video.notes_count} <SearchIcon className="ml-1" />
                </p>
              </div>

              {/* ポップオーバーやいいね部分もそのままここに置いてOK */}
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: 'none',
                  '.MuiPopover-paper': {
                    width: '600px',
                    marginTop: '10px',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                {renderNoteList()}
              </Popover>

              {currentUser && (
                <div className="flex items-center mt-2">
                  {video.liked ? (
                    <Tooltip title="いいね解除">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={async () => {
                          const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                          if (like) await handleUnlikeVideo(video.id, like.id);
                        }}
                      >
                        <IconButton color="secondary">
                          <FavoriteIcon style={{ color: 'red' }} />
                        </IconButton>
                        <span className="text-black">いいね解除</span>
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip title="いいね">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={async () => {
                          await handleLikeVideo(video.id);
                        }}
                      >
                        <IconButton color="primary">
                          <FavoriteBorderIcon />
                        </IconButton>
                        <span className="text-black">いいねする</span>
                      </div>
                    </Tooltip>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>

  );
};

export default YoutubeVideoCard;
